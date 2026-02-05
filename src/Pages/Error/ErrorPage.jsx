import FuzzyText from "./FuzzyText";

const ErrorPage = () => {
    const enableHover = true
    const hoverIntensity = 0.5
  return (
    <div className="flex items-center justify-center">
        <title>Error 404</title>
        <div className='flex flex-col gap-5 justify-center items-center bg-black min-h-screen'>
          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={hoverIntensity}
            enableHover={enableHover}>
            404
          </FuzzyText>
          <FuzzyText fontSize="2rem" baseIntensity={0.1}>
            Oops! Not Found
          </FuzzyText>
        </div>
    </div>
  );
};
export default ErrorPage;