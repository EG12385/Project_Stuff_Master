import { NoDataFound } from "@/components/no-data-found";
import { useNavigate } from "react-router";


export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <NoDataFound
      title="Page not found"
      description="We couldn't find that page."
      buttonText="Go home"
      buttonAction={() => navigate("/")}
    />
  );
}