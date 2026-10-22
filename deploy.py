import subprocess
import sys
from datetime import datetime


def run_command(command, description):
    print(f"\n{'=' * 60}")
    print(f"▶ {description}")
    print(f"  Command: {' '.join(command)}")
    print(f"  Started: {datetime.now().strftime('%H:%M:%S')}")
    print(f"{'=' * 60}\n")

    result = subprocess.run(
        command,
        text=True,
        capture_output=True
    )

    # Show command output
    if result.stdout:
        print(result.stdout)

    if result.stderr:
        print(result.stderr, file=sys.stderr)

    if result.returncode == 0:
        print(f"\n✅ {description} completed successfully")
        print(f"   Finished: {datetime.now().strftime('%H:%M:%S')}")
    else:
        print(f"\n❌ {description} FAILED")
        print(f"   Exit code: {result.returncode}")
        print(f"   Finished: {datetime.now().strftime('%H:%M:%S')}")

        # Stop if the command failed
        sys.exit(result.returncode)


commands = [
    (["git", "pull"], "Pull latest changes"),
    (["python3", "backend/scripts/generate_template_thumbnails.py", "--force"], "Regenerate template thumbnails"),
    (["systemctl", "restart", "truemarriage"], "Restart truemarriage"),
    (["bash", "-c", "cd frontend/ && npm run build"], "Build frontend"),
]


print("\n🚀 Starting deployment...\n")

for command, description in commands:
    run_command(command, description)

print("\n" + "=" * 60)
print("🎉 DEPLOYMENT COMPLETED SUCCESSFULLY")
print(f"   Finished: {datetime.now().strftime('%H:%M:%S')}")
print("=" * 60)
