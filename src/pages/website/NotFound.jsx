import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import Button from "@/components/common/Button";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* 404 */}
          <h1 className="text-[150px] md:text-[200px] font-bold text-slate-800 leading-none">
            404
          </h1>

          {/* Content */}
          <div className="relative -mt-16 md:-mt-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto">
              Oops! The page you're looking for doesn't exist. It might have
              been moved or deleted.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button size="lg" icon={Home}>
                  Go Home
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
