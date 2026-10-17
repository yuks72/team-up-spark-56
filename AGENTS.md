<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep existing profile/project demo storage untouched; new meetings use a separate owner-scoped Cloud table so adding Calendar cannot overwrite existing browser data.
- Calendar date calculations and validation live in a pure meetings module with focused tests; use local wall-clock dates/times consistently for this timezone-free MVP.
- Calendar is a public route with inline social sign-in for private CRUD; database RLS, not the demo profile or local project IDs, controls access.
