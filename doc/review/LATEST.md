# Latest project review (forest-portal)

This folder stores **dated** review runs written by the workspace skill `forest-cross-review` (see `.cursor/skills/forest-cross-review/SKILL.md` at the monorepo root).

## Layout

- Each run lives in `doc/review/YYYYMMDD/` (eight-digit date).
- `LATEST.md` (this file) should be regenerated after each run:

```bash
cd /path/to/forest-project/.cursor/skills/forest-cross-review/scripts
python3 generate_latest.py portal "short summary of the latest pass"
```

Until the first `YYYYMMDD/` folder exists, there is nothing to link from here.

## Related docs

- Portal agent guide: [`../../AGENTS.md`](../../AGENTS.md)
- Cross-repo overview: [`../../../AGENTS.md`](../../../AGENTS.md)
