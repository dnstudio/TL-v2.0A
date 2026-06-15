import { useState, useEffect } from "react";
import { DecisionUnit } from "../../../types";
import { Modal, Input, Select, Button, Typography } from "../../../components/ui";

const RULE_TYPES = [
  "Duration / persistence requirement",
  "Symptom threshold",
  "Domain requirement",
  "Functional impairment requirement",
  "Onset requirement",
  "Context / setting requirement",
  "Exclusion rule",
  "Severity classification rule",
  "Modifier (e.g. age, context, presentation)",
  "Differential diagnosis flag",
  "Informational / illustrative rule"
];

interface AddUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddUnit: (unit: Partial<DecisionUnit>) => void;
  initialRuleType?: string;
}

export function AddUnitModal({ isOpen, onClose, onAddUnit, initialRuleType }: AddUnitModalProps) {
  const [selectedRuleType, setSelectedRuleType] = useState(RULE_TYPES[0]);
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [explanation, setExplanation] = useState("Explain what this rule means clinically and how it should be interpreted.");
  const [pop, setPop] = useState("Both");
  const [source, setSource] = useState("ICD-11");
  const [sourceLink, setSourceLink] = useState("example.com");

  // Sync state if initialRuleType or isOpen changes
  useEffect(() => {
    if (isOpen) {
      if (initialRuleType) {
        // Find the closest match in RULE_TYPES or use as is if it's broad
        const match = RULE_TYPES.find(r => r.startsWith(initialRuleType) || initialRuleType.startsWith(r.split(' ')[0]));
        const finalType = match || initialRuleType;
        setSelectedRuleType(finalType);
        setUnit(finalType.toLowerCase().includes("duration") ? "Months" : "Count");
      } else {
        const defaultType = RULE_TYPES[0];
        setSelectedRuleType(defaultType);
        setUnit(defaultType.toLowerCase().includes("duration") ? "Months" : "Count");
      }
      setValue("");
      // Reset form on open
      setExplanation("Explain what this rule means clinically.");
    }
  }, [isOpen, initialRuleType]);

  const handleSubmit = () => {
    const finalLogic = explanation.length > 80 ? explanation.substring(0, 80) + "..." : explanation;
    onAddUnit({
      type: selectedRuleType,
      logic: value ? `${selectedRuleType}: ${value} ${unit}` : finalLogic,
      explanation: explanation,
      pop: pop,
      source: source,
      sourceLink: sourceLink,
      status: "Draft",
      group: selectedRuleType.split(' ')[0]
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={selectedRuleType.includes("Duration") ? "Add Duration Unit" : "Add Decision Unit"}
      width={600}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Rule
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <Select 
          label="Rule type"
          value={selectedRuleType}
          onChange={(e) => setSelectedRuleType(e.target.value)}
        >
          {RULE_TYPES.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>

        <div className="flex gap-4">
          <Input 
            label="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 6"
          />
          <Input 
            label="Unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>

        <div className="relative group">
          <span className="absolute -top-2 left-2 px-1 bg-white text-[10px] uppercase tracking-wider font-bold text-text-secondary z-10 transition-colors group-focus-within:text-primary">
            Clinical Explanation
          </span>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="w-full min-h-[100px] border border-divider rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
          />
        </div>

        <div className="flex gap-4">
          <Select 
            label="Population"
            value={pop}
            onChange={(e) => setPop(e.target.value)}
          >
            <option>Both</option>
            <option>Adult</option>
            <option>Pediatric</option>
          </Select>

          <Select 
            label="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option>ICD-11</option>
            <option>DSM-5-TR</option>
          </Select>
        </div>
      </div>
    </Modal>
  );
}
