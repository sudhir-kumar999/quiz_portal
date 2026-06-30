import StudentDashboard from "@/components/student/StudentDashboard";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StudentDashboard>
      {children}
    </StudentDashboard>
    
  );
}