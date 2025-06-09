import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSimulationStore } from "../store";
import "../styles/fonts.css";
import type { CSSProperties } from "react";

// Import common components
import PageLayout from "../components/layout/PageLayout";
import Toolbar from "../components/layout/Toolbar";
import Button from "../components/layout/Button";
import TextField from "../components/layout/TextField";

const CreateSimulation = () => {
  const navigate = useNavigate();
  const { simulationName, setSimulationName, description, setDescription } = useSimulationStore();
  const [error, setError] = useState<string | null>(null);
  const maxChars = 800;
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    if (!simulationName.trim()) {
      setError("Simulation name is required");
      return;
    }

    if (!description.trim()) {
      setError("Description is required");
      return;
    }

    setIsLoading(true);
    
    // Log the simulation data
    console.log("Creating simulation:", { name: simulationName, description });
    
    // Navigate directly to candidate settings page
    navigate("/candidate-settings");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSimulationName(e.target.value);
    if (error) setError(null);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= maxChars) {
      setDescription(text);
      if (error) setError(null);
    }
  };

  // Form container styles
  const formContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 'calc(100vh - 180px)', // Account for increased toolbar height
    overflowX: 'hidden',
  };

  // Fields container style
  const fieldsContainerStyle: CSSProperties = {
    width: '90%',
    maxWidth: '1200px',
    display: 'flex',
    flexDirection: 'column',
    gap: '58px',
  };

  return (
    <PageLayout>
      <Toolbar 
        title="Create Your World" 
        actions={
          <Button 
            onClick={handleContinue} 
            disabled={!simulationName.trim() || !description.trim()}
            isLoading={isLoading}
            className="w-[300px] h-[80px] px-0 py-0"
          >
            Continue
          </Button>
        }
      />

      {/* Main content container */}
      <div style={formContainerStyle}>
        {/* Form fields container */}
        <div style={fieldsContainerStyle}>
          {/* Name Field */}
          <TextField
            label="Name this election"
            placeholder="Write Name"
            value={simulationName}
            onChange={handleNameChange}
            error={error && !simulationName.trim() ? error : undefined}
          />
          
          {/* Description Field */}
          <div className="relative w-full">
            <TextField
              label="Describe this election"
              placeholder="Write this description"
              value={description}
              onChange={handleDescriptionChange}
              multiline
              error={error && !description.trim() ? error : undefined}
            />

            {/* Character count display */}
            <div 
              className="absolute bottom-[-30px] right-0 text-white/50 text-sm"
              style={{ fontFamily: "Roboto Mono" }}
            >
              {description.length}/{maxChars} characters
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default CreateSimulation;
