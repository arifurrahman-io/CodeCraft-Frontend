import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import Button from "@/components/common/Button";

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="container-custom py-16 text-center max-w-lg">
        <p className="text-sm font-semibold text-accent mb-3">404</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-ink tracking-tight mb-4">
          Page not found
        </h1>
        <p className="text-ink-muted mb-8 leading-relaxed">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button size="lg" icon={Home}>
              Go home
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg">
              Contact us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
