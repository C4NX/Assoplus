import type { H3Event } from 'h3'

export function emailTemplateBase(event: H3Event, {
    title,
    content,
}: {
    title: string
    content: string
}) {
    const { public: { contactEmail }, baseUrl } = useRuntimeConfig(event)

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #66CC8A;
            padding: 20px;
            text-align: center;
            color: white;
            border-radius: 5px 5px 0 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .header img {
            width: 50px;
            height: auto;
            margin-right: 15px;
        }
        .header h1 {
            margin: 0;
        }
        .content {
            padding: 20px;
            background-color: #f9f9f9;
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
        }
        .footer {
            background-color: #f2f2f2;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-radius: 0 0 5px 5px;
            border: 1px solid #ddd;
        }
        a {
            color: #4285f4;
        }
    </style>
</head>
<body>
    <div class="header">
        <img src="${baseUrl}/logo.svg" alt="Logo">
        <h1>Asso+</h1>
    </div>
    <div class="content">
        <h2>${title}</h2>
        ${content}
    </div>
    <div class="footer">
        <p>© ${new Date().getFullYear()} Asso+. Tous droits réservés.</p>
        <p>Pour toute question, contactez-nous à <a href="${contactEmail}">contact@assoplus.com</a></p>
    </div>
</body>
</html>
  `
}