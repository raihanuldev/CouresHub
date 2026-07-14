
import { useState } from "react";
import Swal from "sweetalert2";
import instance from "../../api/axios";
import { HiShieldCheck, HiAcademicCap, HiUser } from "react-icons/hi";

const AdminUserTableRow = ({ user, index, refetch }) => {
  const [loading, setLoading] = useState(false);

  const getRoleInfo = () => {
    switch (user.role) {
      case "admin":
        return { label: "Admin", icon: <HiShieldCheck />, color: "bg-red-100 text-red-800" };
      case "instructor":
        return { label: "Instructor", icon: <HiAcademicCap />, color: "bg-green-100 text-green-800" };
      default:
        return { label: "Student", icon: <HiUser />, color: "bg-gray-100 text-gray-800" };
    }
  };

  const role = getRoleInfo();

  const handleMakeAdmin = async () => {
    const result = await Swal.fire({
      title: "Make Admin?",
      text: "This user will have full access!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });
    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await instance.put(`/user/make-admin/${user._id}`);
      refetch();
      Swal.fire("Success", "User is now Admin", "success");
    } catch {
      Swal.fire("Error", "Failed to update", "error");
    }
    setLoading(false);
  };

  const handleMakeInstructor = async () => {
    const result = await Swal.fire({
      title: "Make Instructor?",
      text: "User can create courses",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#000000",
    });
    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await instance.put(`/instructor/make-instructors/${user._id}`);
      refetch();
      Swal.fire("Success", "User is now Instructor", "success");
    } catch {
      Swal.fire("Error", "Failed to update", "error");
    }
    setLoading(false);
  };

  return (
    <tr className="hover:bg-base-200 transition-colors">
      <td className="font-medium">{index}</td>
      <td>
        <div className="flex items-center gap-3">

          <div>
            <div className="font-bold">{user.name}</div>
          </div>
        </div>
      </td>
      <td className="text-base-content/70">{user.email}</td>
      <td>
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${role.color}`}>
          {role.icon}
          {role.label}
        </div>
      </td>
      <td>
        <div className="flex justify-center gap-2">
          <button
            onClick={handleMakeAdmin}
            disabled={user.role === "admin" || loading}
            className="btn btn-sm btn-error"
          >
            {loading ? <span className="loading loading-spinner"></span> : "Admin"}
          </button>
          <button
            onClick={handleMakeInstructor}
            disabled={user.role === "instructor" || loading}
            className="btn btn-sm btn-success"
          >
            Instructor
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AdminUserTableRow;