import { Counter } from "../components/Counter";

const Welcome = () => {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome Screen</h1>
      <p className="text-lg">This is the first screen.</p>
      <Counter />
    </div>
  );
};

export default Welcome;
