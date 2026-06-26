import TeacherDashboard from "@/components/TeacherDashboard";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TeacherDashboard>
      {children}
    </TeacherDashboard>
  );
}