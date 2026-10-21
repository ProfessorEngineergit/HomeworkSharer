# HomeworkSharer

Static interface prototype for a homework-sharing app for students and teachers.

## Current status

The repository contains `index.html`, `style.css` and `main.js`. The interface demonstrates navigation, homework cards and a detail modal. Selecting a file currently logs its name in the browser console; it does not upload the file to a server. Other action buttons also contain placeholder handlers.

There is no backend, account system, persistent file storage, moderation service or native iOS application in this branch.

## Run the prototype

From the repository root:

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`. The page uses placeholder content and an external avatar image.

## Proposed next steps

- Define accounts, class membership and access rules.
- Implement and test a file-upload and storage service.
- Add comments, teacher feedback and moderation with clear ownership.
- Evaluate an iOS client after the API and web workflows work.

The earlier README listed research references on collaborative learning and moderation. Those references were design background, not an evaluation of this prototype or evidence that its features improve learning outcomes.

## License

See [LICENSE](LICENSE), which contains the GNU GPL version 3 text. This edit does not change the license file.

## Development and AI assistance

The default-branch history includes contributions explicitly attributed to GitHub Copilot / Google Jules ([example](https://github.com/ProfessorEngineergit/HomeworkSharer/commit/4411517455d7a33d3ee081084d25d9a8644c856b)). This documents AI involvement in those contributions; it does not establish the origin of every line or independent validation. Existing author, co-author and session records are retained.
