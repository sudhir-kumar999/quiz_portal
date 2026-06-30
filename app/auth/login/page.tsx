import LoginQuiz from "@/components/LoginQuiz";
import PublicNav from "@/components/PublicNav";

export default function page() {
  return (
    <div className='mt-20'>
      <PublicNav/>
      <LoginQuiz/>
    </div>
  );
}
