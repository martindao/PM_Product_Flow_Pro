
from datetime import datetime, timedelta

CUTOFF_DAYS = 60
cutoff = datetime.utcnow() - timedelta(days=CUTOFF_DAYS)

def commit_callback(commit):
    # Always align committer_date to author_date for UI consistency
    try:
        # If author_date missing, bail
        _ = commit.author_date
    except Exception:
        return

    commit.committer_date = commit.author_date

    # Shift too-recent commits back in time
    try:
        ad = commit.author_date.decode()
        # Expect 'YYYY-MM-DD HH:MM:SS +ZZZZ'; parse first 19 chars
        d = datetime.strptime(ad[:19], '%Y-%m-%d %H:%M:%S')
    except Exception:
        return

    if d > cutoff:
        new = (cutoff - timedelta(days=7)).replace(hour=14, minute=0, second=0)
        ts = (new.strftime('%Y-%m-%d %H:%M:%S') + ' +0000').encode('utf-8')
        commit.author_date = ts
        commit.committer_date = ts

# [2024-12-27] (MCP) schedule note: Document expert workflow for MCP

# [2025-03-31] (Workflow) schedule note: Document expert workflow for Workflow
