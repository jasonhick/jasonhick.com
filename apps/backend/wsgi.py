import os
import sys
from pathlib import Path

# Add the parent directory (apps) to Python path
root_path = Path(__file__).parent.parent
sys.path.append(str(root_path))

from backend.src import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
