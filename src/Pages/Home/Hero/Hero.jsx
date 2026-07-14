import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left side content */}
          <div data-aos="fade-right">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
              Build Your Skills.<br />
              <span className="text-primary">Master Technology Courses</span> at Your Pace
            </h1>

            <p className="text-xl text-base-content/70 mt-6">
              Explore structured courses in Web Development, Data Science, AI, Cloud, DevOps, and more.
              Learn from expert instructors, track your progress, and manage your learning hub in one place.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/courses" className="btn btn-primary btn-md shadow-lg">
                Explore Courses Hub
              </Link>
              <Link to="/dashbord" className="btn btn-outline btn-secondary btn-md">
                Go to My Learning Dashboard
              </Link>
            </div>
          </div>

          <div data-aos="fade-left" className="flex justify-center">
            {/* Option 1: Image */}
            {/* <img
              src="https://images.unsplash.com/photo-1581092333840-2a0c4d4b2b2d?auto=format&fit=crop&w=800&q=80"
              alt="Courses Hub"
              className="rounded-xl shadow-xl w-full max-w-lg"
            /> */}

            {/* Option 2: YouTube Video */}

            <div className="w-full max-w-lg aspect-video rounded-xl overflow-hidden shadow-xl">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/2SXCR-43RjM?si=sIaIcQ5wnzhaCsAK"
                title="Courses Hub Overview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
