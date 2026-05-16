<?php
$siteName = 'CodeCraft.BD';
$defaultDescription = 'CodeCraft.BD builds premium web applications, mobile apps, SaaS products, e-commerce platforms, and UI/UX experiences for growing businesses.';
$defaultImage = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80';

$apiBaseUrl = getenv('API_BASE_URL') ?: getenv('VITE_API_BASE_URL') ?: 'https://api.codecraft.bd/api/v1';
$siteUrl = getenv('SITE_URL') ?: getenv('VITE_SITE_URL') ?: 'https://codecraft.bd';

$apiBaseUrl = rtrim($apiBaseUrl, '/');
$siteUrl = rtrim($siteUrl, '/');

function e($value) {
  return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function truncateText($value, $limit = 180) {
  $text = trim(preg_replace('/\s+/', ' ', (string) $value));
  $length = function_exists('mb_strlen') ? mb_strlen($text, 'UTF-8') : strlen($text);

  if ($length <= $limit) {
    return $text;
  }

  $slice = function_exists('mb_substr')
    ? mb_substr($text, 0, $limit - 3, 'UTF-8')
    : substr($text, 0, $limit - 3);

  return rtrim($slice) . '...';
}

function absoluteUrl($value, $baseUrl) {
  if (!$value) {
    return '';
  }

  if (preg_match('/^https?:\/\//i', $value)) {
    return $value;
  }

  return $baseUrl . '/' . ltrim($value, '/');
}

function fetchJson($url) {
  if (function_exists('curl_init')) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_CONNECTTIMEOUT => 5,
      CURLOPT_TIMEOUT => 10,
      CURLOPT_USERAGENT => 'CodeCraft share preview renderer',
    ]);

    $body = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($body !== false && $status >= 200 && $status < 300) {
      return json_decode($body, true);
    }

    return null;
  }

  $body = @file_get_contents($url);
  return $body ? json_decode($body, true) : null;
}

function unwrapItem($payload, $type) {
  if (!$payload || !is_array($payload)) {
    return null;
  }

  $keys = $type === 'project'
    ? [['data', 'project'], ['project'], ['data', 'data'], ['data']]
    : [['data', 'blog'], ['blog'], ['data', 'data'], ['data']];

  foreach ($keys as $path) {
    $current = $payload;

    foreach ($path as $key) {
      if (!is_array($current) || !array_key_exists($key, $current)) {
        $current = null;
        break;
      }

      $current = $current[$key];
    }

    if (is_array($current)) {
      return $current;
    }
  }

  return $payload;
}

$type = $_GET['type'] ?? '';
$slug = $_GET['slug'] ?? '';

if (!in_array($type, ['blog', 'project'], true) || $slug === '') {
  http_response_code(400);
  echo 'Invalid share preview request';
  exit;
}

$apiPath = $type === 'project' ? 'projects' : 'blogs';
$pagePath = $type === 'project' ? '/projects/' . $slug : '/blogs/' . $slug;
$payload = fetchJson($apiBaseUrl . '/' . $apiPath . '/' . rawurlencode($slug) . '?preview=1');
$item = unwrapItem($payload, $type);

$rawTitle = $item['seoTitle'] ?? $item['title'] ?? $siteName;
$title = strpos($rawTitle, $siteName) !== false ? $rawTitle : $rawTitle . ' | ' . $siteName;
$description = $item['seoDescription']
  ?? $item['excerpt']
  ?? $item['shortDescription']
  ?? $item['description']
  ?? $defaultDescription;
$image = $item['coverImage'] ?? $item['image'] ?? $item['thumbnail'] ?? $defaultImage;
$canonicalUrl = $siteUrl . $pagePath;
$imageUrl = absoluteUrl($image, $siteUrl);

header('Content-Type: text/html; charset=UTF-8');
header('Cache-Control: public, max-age=300, stale-while-revalidate=86400');
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><?= e($title) ?></title>
    <meta name="description" content="<?= e(truncateText($description)) ?>" />
    <link rel="canonical" href="<?= e($canonicalUrl) ?>" />
    <meta property="og:site_name" content="<?= e($siteName) ?>" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="<?= e($title) ?>" />
    <meta property="og:description" content="<?= e(truncateText($description)) ?>" />
    <meta property="og:url" content="<?= e($canonicalUrl) ?>" />
    <meta property="og:image" content="<?= e($imageUrl) ?>" />
    <meta property="og:image:secure_url" content="<?= e($imageUrl) ?>" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="<?= e($title) ?>" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?= e($title) ?>" />
    <meta name="twitter:description" content="<?= e(truncateText($description)) ?>" />
    <meta name="twitter:image" content="<?= e($imageUrl) ?>" />
  </head>
  <body>
    <a href="<?= e($canonicalUrl) ?>"><?= e($title) ?></a>
  </body>
</html>
