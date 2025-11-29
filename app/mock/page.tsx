import Mock from "./_components/Mock";
import { Header } from "@/app/_components/Header";

const MockPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-4">
        <Mock />
      </main>
    </div>
  );
};

export default MockPage;

