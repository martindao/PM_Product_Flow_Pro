#!/usr/bin/env python3
import subprocess
import sys
import os
from datetime import datetime

def fix_commit_dates():
    """Fix commit dates using git-filter-repo"""
    target_date = "2022-09-15 14:00:00 -0500"
    repo_name = "Product_Flow_Pro"
    
    print(f"🎯 Processing: {repo_name}")
    print(f"📅 Target date: {target_date}")
    
    # Check git-filter-repo availability
    try:
        result = subprocess.run(
            ["git", "filter-repo", "--help"], 
            capture_output=True, 
            text=True,
            check=False
        )
        if result.returncode != 0:
            print("❌ git-filter-repo not found!")
            return False
    except FileNotFoundError:
        print("❌ git-filter-repo not installed!")
        return False
    
    print("✅ git-filter-repo available")
    
    # Create backup branch
    backup_branch = f"backup-before-fix-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    try:
        subprocess.run(
            ["git", "checkout", "-b", backup_branch], 
            check=True,
            capture_output=True
        )
        print(f"✅ Backup created: {backup_branch}")
    except:
        print("⚠️  Could not create backup (continuing)")
    
    # Use git-filter-repo with commit-callback
    callback_code = f"""
# Fix commit dates to historical values
commit.author_date = b"{target_date}"
commit.committer_date = b"{target_date}"
"""
    
    cmd = [
        "git", "filter-repo", 
        "--force",
        "--commit-callback", callback_code
    ]
    
    print("🔧 Running git-filter-repo...")
    print(f"Command: {' '.join(cmd)}")
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Successfully fixed commit dates!")
            
            # Verify the fix
            verify_result = subprocess.run(
                ["git", "log", "-1", "--pretty=format:'Author: %ai | Committer: %ci'"],
                capture_output=True,
                text=True,
                check=True
            )
            print(f"📋 Verification: {verify_result.stdout.strip()}")
            return True
        else:
            print(f"❌ Error: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

if __name__ == "__main__":
    success = fix_commit_dates()
    sys.exit(0 if success else 1)
