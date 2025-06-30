from .base_agent import BaseAgent
from .prompts.super_prompts import MARKET_ANALYST_PERSONA, MARKET_ANALYST_GOAL
from apps.projects.models import Project

class MarketAnalystAgent(BaseAgent):
    """
    Analyzes a user's website to generate a detailed user persona.
    """
    def __init__(self):
        super().__init__(
            agent_name="Market Analyst",
            agent_persona=MARKET_ANALYST_PERSONA,
            goal=MARKET_ANALYST_GOAL
        )

    def execute(self, project_id: int):
        """
        Performs the market analysis for a given project.
        
        Args:
            project_id (int): The ID of the project to analyze.
        """
        print(f"Executing Market Analyst Agent for project {project_id}...")
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            print(f"Error: Project with ID {project_id} not found.")
            return

        # 1. Construct the detailed task for the Gemini API
        task_description = f"""
        Analyze the content of the website at the following URL: {project.source_url}.
        
        Your analysis should be deep and insightful, covering the following:
        - **Target Demographics:** Age, gender, location, income level, education.
        - **Psychographics:** Interests, values, lifestyle, pain points, and motivations.
        - **User Goals:** What is the primary goal a user has when visiting this site?
        - **Key Value Proposition:** What is the unique value the website offers?
        
        Based on this analysis, generate a comprehensive user persona document. The document should be formatted in clean Markdown and include a catchy name for the persona (e.g., 'Creative Catherine', 'Startup Steve').
        """
        
        full_prompt = self._generate_prompt(task_description)

        # 2. (Simulated) Call the Gemini API
        # In the final version, this will be an actual API call.
        # response = self.model.generate_content(full_prompt)
        # persona_document = response.text
        
        # For now, we use a placeholder response for structure.
        persona_document = f"## Persona: Startup Steve\n\n**Age:** 28-40\n\n**Bio:** Steve is an ambitious, tech-savvy entrepreneur who runs a small but growing e-commerce business based on the content from {project.source_url}. He is always looking for ways to scale his operations and engage his customers more effectively."

        # 3. Update the project model with the result
        project.user_persona_document = persona_document
        project.status = Project.ProjectStatus.ANALYSIS_COMPLETE
        project.save()
        
        print(f"Market Analysis complete for project {project_id}. Persona generated.")
        
        # 4. (Future) Trigger the next agent in the chain
        #design_agent.delay(project_id=project.id)
        project.status_message = "Analyzing website content and structure..."
        project.save()
        
        project.user_persona_document = persona_document
        project.status_message = "Market analysis complete. User persona generated."
        project.status = Project.ProjectStatus.ANALYSIS_COMPLETE
        project.save()
        
