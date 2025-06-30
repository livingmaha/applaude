
from .base_agent import BaseAgent
from .prompts.super_prompts import CODE_GEN_PERSONA, CODE_GEN_GOAL
from apps.projects.models import Project

class CodeGenAgent(BaseAgent):
    """
    Generates the mobile application source code.
    """
    def __init__(self):
        super().__init__(
            agent_name="Code Generation",
            agent_persona=CODE_GEN_PERSONA,
            goal=CODE_GEN_GOAL
        )

    def execute(self, project_id: int):
        """
        Generates the source code for a given project.
        
        Args:
            project_id (int): The ID of the project to build.
        """
        print(f"Executing Code Generation Agent for project {project_id}...")
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            print(f"Error: Project with ID {project_id} not found.")
            return

        # 1. Gather all data
        user_persona = project.user_persona_document
        palette = project.brand_palette
        app_type = project.app_type

        # 2. Construct the detailed task for the Gemini API
        task_description = f"""
        Project Brief: Generate the source code for a mobile app with the following specifications.
        
        - **Target Platform(s):** {app_type}
        - **Core User Persona:**\n{user_persona}
        - **Brand Color Palette:**\n{palette}
        - **Core Feature:** The primary feature of the app should be to showcase content/products from the original website ({project.source_url}). This should include a main screen with a list of items and a detail screen for each item.
        
        Your Task:
        1.  Define a logical file structure for the {app_type} application.
        2.  Generate the code for the main entry point of the app.
        3.  Generate the code for the main screen, which should display a list of placeholder items using the brand's primary colors.
        4.  Generate the code for a theme or style file that implements the provided color palette.
        
        The output must be a series of code blocks, each preceded by a comment specifying the full file path.
        """
        
        full_prompt = self._generate_prompt(task_description)

        # 3. (Simulated) Call Gemini API and update project
        # response = self.model.generate_content(full_prompt)
        # generated_code_files = response.text
        # For now, we will mark the project as complete.
        
        project.status = Project.ProjectStatus.COMPLETED
        project.save()

        print(f"Code Generation complete for project {project_id}. Project is now marked as COMPLETED.")
