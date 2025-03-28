// uploadRuleGenerator.js

// Generate boilerplate metadata
function boilerPlateMetadata() {
  return `
// Metadata
var drawingNumber = input.metadata("DRAWING_NUM");
var drawingTitle = input.metadata("DRAWING_TITLE");
var workflow = input.metadata("WORKFLOW");
var targetGroup = input.metadata("TARGET_GROUP");
var artefactType = input.metadata("ARTEFACT_TYPE");
var bucket = input.bucket();
`;
}

// Generate workflow IDs
function workflowIDs(workflows) {
  if (!workflows || workflows.length === 0) {
      return "\n// No Workflows Configured";
  }
  let workflowVariables = "\n// Workflow IDs";
  workflows.forEach((workflow, index) => {
      workflowVariables += `\nvar workflow${index + 1} = ${workflow.id || 0}; // ${workflow.name || ""}`;
  });
  return workflowVariables;
}

// Generate artefact creation logic
function artefactCreationLogic(workflows) {
  let logic = "\n// Artefact creation logic";
  
  if (!workflows || workflows.length === 0) {
      return "\n// Artefact creation logic\naction = create.newArtefactNoWorkflow(drawingNumber, drawingTitle, targetGroup);";
  }
  
  workflows.forEach((workflow, index) => {
      const condition = index === 0 ? "if" : "else if";
      logic += `
${condition} (workflow === '${workflow.name || ""}') {
  action = create.newArtefact(drawingNumber, drawingTitle, targetGroup, workflow${index + 1});
}`;
  });

  logic += `
else {
  action = create.newArtefactNoWorkflow(drawingNumber, drawingTitle, targetGroup);
}`;
  
  return logic;
}

// Main function to generate upload rule
export function uploadRuleGenerator(workflows) {
  let rule = "";
  rule += boilerPlateMetadata();
  rule += "\n";
  rule += workflowIDs(workflows);
  rule += "\n";
  rule += artefactCreationLogic(workflows);
  
  return rule;
}
