import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import instance from "../../api/axios";
import { Helmet } from "react-helmet-async";
import { HiArrowLeft } from "react-icons/hi";

const CoursePlayer = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [content, setContent] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch course details
    instance.get(`/coures/getcoures/${id}`).then((res) => {
      setCourse(res.data.data || res.data);
    });

    // Fetch content
    instance
      .get(`coures/content-collections/${id}`)
      .then((res) => {
        const data = res.data.data || res.data;
        setContent(data?.content || []);
        if (data?.content?.length > 0) {
          setSelectedVideo(data.content[0].videoUrl);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <Helmet>
        <title>{course?.name || "Course"} | CourseHub Player</title>
      </Helmet>

      {/* Header */}
      <div className="bg-base-100 shadow-md">
        <div className="max-w-7xl mx-auto p-6 flex items-center gap-4">
          <Link to="/dashbord" className="btn btn-ghost btn-circle">
            <HiArrowLeft className="text-2xl" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{course?.name || "Loading..."}</h1>
            <p className="text-base-content/70">
              {content.length} {content.length === 1 ? "Module" : "Modules"}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Video Player - Takes 3/4 */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            {selectedVideo ? (
              <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                <iframe
                  src={selectedVideo}
                  title="Course Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            ) : (
              <div className="aspect-video bg-base-300 rounded-xl flex items-center justify-center overflow-hidden">
                <img
                  src={course?.image}
                  alt={course?.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Sidebar - Fixed Width & Scrollable */}
          <div className="lg:col-span-1 order-1 lg:order-2">
            <div className="bg-base-100 rounded-xl shadow-lg h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-base-300">
                <h2 className="text-xl font-bold">Course Modules</h2>
              </div>

              {/* Scrollable Module List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 max-h-[calc(100vh-240px)]">
                {content.length === 0 ? (
                  <p className="text-center text-base-content/60 py-10">
                    No modules added yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {content.map((module, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedVideo(module.videoUrl)}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                          selectedVideo === module.videoUrl
                            ? "bg-primary text-white shadow-lg ring-2 ring-primary/50"
                            : "bg-base-200 hover:bg-base-300 hover:shadow-md"
                        }`}
                      >
                        <div className="font-semibold">{module.moduleName}</div>
                        <div className="text-sm opacity-80 mt-1">
                          Lesson {index + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;