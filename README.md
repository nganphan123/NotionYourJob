<p align="center">
  <img src="/images/logo.svg" />
</p>

# [Notion Your Job](https://chromewebstore.google.com/detail/notion-your-job/kidlkkpdnkmdjoapmokjnipojbfhjcgf?authuser=1&hl=en-GB)


https://github.com/user-attachments/assets/4a2e2948-4e98-4a7e-ad17-67fea3f19784

This is a Chrome extension that lets you track your job application in just one click. As a Notion enthusiast who uses Notion to track down all the tasks and a job hunter, I used to switch between browser tabs to add new application records to my Notion table. This is, of course, a repetitive task for job hunter who aims for a plethora of applications per day. Hence, I decided to automate the steps by leveraging Chrome extension, which is within reach on the same tab. Moreover, the extension can automatically record the URL and job description for your reference later. This is a summary of what the extension can do:

- Prepare all the tables in Notion (you just need to log in 😉)
- Record job applications to Notion
- Record job description and URL

## Getting Started

Check out the extension:
1. Install the extension [here](https://chromewebstore.google.com/detail/notion-your-job/kidlkkpdnkmdjoapmokjnipojbfhjcgf?authuser=1&hl=en-GB)
2. [How to use](https://angry-dosa-94c.notion.site/Home-page-f591676116b6499fb416a6074213a929#141d0a530122803ea8bde38301f38715)

The steps below guide you on how to run the extension locally
### Prerequisites

1. Chrome browser
2. Notion account
3. Notion APIs secret

### Installing

#### Get Notion APIs secret

After you've created Notion account [here](https://www.notion.so/), navigate to the [integrations management](https://www.notion.so/profile/integrations) and create new integration. The configuration requires these fields:

- Integration name: you name it
- Associated workspace
- Type: Public
- Company name: you name it
- Website, Privacy Policy URL, and Terms of Use URL: can be any URLs
- Your Email
- Redirect URIs: you can put any URL here for now, we'll come back and replace it with the correct one after

You can find the APIs secret in the configuration part of your new integration.

![new integration example](/images/new-integration-example.png)
![new integration example](/images/new-integration-example-2.png)
![api scret](/images/api-secret.png)

#### Build extension code

1. Set env vars in your terminal. The variables can be found in `.env.example`
2. At the top folder of the project, run `npm run build`. You should see `dist` folder after the command runs successfully
3. Go to Chrome browser and upload the `dist` folder as an extension

#### Chrome Extension ID

After you've uploaded the extension code to Chrome, you'll have an extension ID. Now you can replace the redirect URL in the notion integration to `https://<you-chrome-extension-id>.chromiumapp.org/notion-app`.

![extension id](/images/extension-id.png)

## Built With

- [Notion APIs](https://developers.notion.com/)
- [Chrome Extension](https://developer.chrome.com/docs/extensions)
- [Typescript](https://www.typescriptlang.org/)
- [React](https://react.dev/)
- [webpack](https://webpack.js.org/)

## Authors

- **Ngan Phan** - [LinkedIn](https://www.linkedin.com/in/ngan-p/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
