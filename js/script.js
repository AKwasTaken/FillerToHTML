function parseAndCleanScript(string) {
    function parseScript(string) {
        let stack = [];
        let current = [];
        let segment = "";
        let funcName = null;

        for (let char of string) {
            if (char === '{') {
                if (segment.trim() !== "") {
                    funcName = segment.trim().split(/\s+/).pop();
                    segment = segment.slice(0, -funcName.length).trim();
                    if (segment !== "") {
                        current.push(segment);
                    }
                    segment = "";
                }
                stack.push([current, funcName]);
                current = [];
                funcName = null;
            } else if (char === '}') {
                if (segment.trim() !== "") {
                    current.push(segment.trim());
                    segment = "";
                }
                let [previous, funcName] = stack.pop();
                if (funcName !== null) {
                    current.unshift(funcName);
                }
                previous.push(current);
                current = previous;
            } else if (char === '\n') {
                if (segment.trim() !== "") {
                    current.push(segment.trim());
                    segment = "";
                }
                current.push('\n');
            } else {
                segment += char;
            }
        }

        if (segment.trim() !== "") {
            current.push(segment.trim());
        }

        return current;
    }

    function cleanFunctionList(data) {
        function cleanFunction(item) {
            if (Array.isArray(item) && item.length > 1) {
                if (item[1] === '\n') {
                    item.splice(1, 1);
                }

                while (item.length && item[item.length - 1] === '\n') {
                    item.pop();
                }

                let cleaned = [];
                for (let i = 0; i < item.length; i++) {
                    if (item[i] === '\n') {
                        if (i > 0 && cleaned[cleaned.length - 1] === '\n') {
                            continue;
                        }
                        cleaned.push('\n');
                    } else {
                        cleaned.push(item[i]);
                    }
                }
                return cleaned;
            }
            return item;
        }

        function recursiveClean(data) {
            let result = [];
            for (let element of data) {
                if (Array.isArray(element)) {
                    result.push(cleanFunction(recursiveClean(element)));
                } else {
                    result.push(element);
                }
            }
            return result;
        }

        return recursiveClean(data);
    }

    let parsedOutput = parseScript(string);
    let cleanedOutput = cleanFunctionList(parsedOutput);
    cleanedOutput = cleanedOutput.filter(variable => variable !== '\n');
    return cleanedOutput;
}

function BodyElements(content, style = 'normal') {
    if (content.length === 1) {
        content = content[0];
    }

    switch (style) {
        case 'normal':
            return `<p style="" align="center">${content}</p>`;
        case 'bold':
            return `<p style="" align="center"><b>${content}</b></p>`;
        case 'bigbold':
            return `<h3 style="" align="center">${content}</h3>`;
        case 'bigbolditalic':
            return `<h3 style="" align="center"><i>${content}</i></h3>`;
        case 'bolditalic':
            return `<p style="" align="center"><i><b>${content}</b></i></p>`;
        case 'italic':
            return `<p style="" align="center"><i>${content}</i></p>`;
        case 'pointers':
            let intro = '<ul style="list-style-type: disc; padding-left: 20px; text-align: left; display: inline-block; margin: 0;">';
            let cont = '';
            let outro = '</ul>';

            for (let item of content) {
                if (item === '\n') continue;
                cont += `<li>${item}</li>`;
            }

            return intro + cont + outro;
        case 'link':
            let text = content[0];
            let url = content[1];

            return `
            <a href="${url}" style="color: #25D366; text-decoration: none; display: inline-block;">
                <u>${text}</u>
            </a>
            `;
        case 'image':
            if (typeof content !== 'string' || content.trim() === '') {
                throw new Error('Invalid image content: must be a non-empty string');
            }

            return `
            <div style="display: flex; justify-content: center; align-items: center; position: relative; width: 100%; max-width: 600px; margin: 0 auto;">
                <img src="${content}" 
                    style="width: 100%; height: auto; border-radius: 6px;">
            </div>
            `;
        default:
            throw new Error(`Unsupported style: ${style}`);
    }
}

function ContentBody(lst) {
    let content = "";

    for (let x of lst) {
        if (typeof x === 'string') {
            content += `<p style="" align="center">${x}</p>`;
        } else if (Array.isArray(x)) { // Ensure x is an array
            content += BodyElements(x.slice(1), x[0]);
        }
    }

    return content;
}

function Pointers(lst) {
    let content = '';
    for (let x of lst) {
        if (x === '\n') continue;

        // Correctly splitting into top and value
        let [top, value] = x.split(': ', 2); // Use `2` to explicitly limit to two parts
        let width = top.toLowerCase().includes('speaker') ? 200 : 100;

        content += `
        <tr>
            <td style="" align="left"><strong>${top}:</strong></td>
            <td style="width: ${width}px;" align="right">${value}</td>
        </tr>
        `;
    }

    return content;
}

function RectangleItems(lst) {
    let Data = {};
    for (let item of lst) {
        if (item.includes(": ") && item !== '\n') {
            let [key, value] = item.split(": ").map(part => part.trim());
            Data[key.toLowerCase()] = value;
        }
    }

    let intro = `
        <section class="speaker-cards-container" style="display: inline-block; text-align: center; margin-bottom: 10px;">
            <div class="speaker-card-wrapper" style="display: inline-block; width: 300px; margin: 15px; vertical-align: top;">
                <div class="speaker-profile-card" style="border-radius: 16px; text-align: center; padding: 20px; border: 1px solid #000; background-color: #ffffff;">`;
    let outro = `
                </div>
            </div>
        </section>
        `;

    let img = Data['image'] ? `
        <div style="width: 220px; height: 220px; margin: 0 auto; border-radius: 12px; overflow: hidden;">
            <img src="${Data['image']}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
    ` : " ";
    let name = Data['name'] ? `
        <div style="font-size: 14px; font-weight: bold; margin-top: 8px;">${Data['name']}</div>
    ` : " ";
    let batch = Data['batch'] ? `
        <div style="font-size: 12px; font-weight: 300; margin: 8px 0 18px;">Batch ${Data['batch']}</div>
    ` : " ";
    let dept = Data['dept'] ? `
        <div style="width: 100%; font-size: 11px; font-weight: 300;" align="center">
            <span style="font-weight: bold;">Dept:</span> ${Data['dept']}
        </div>
    ` : " ";
    let research = Data['research focus'] ? `
        <div style="width: 100%; font-size: 11px; font-weight: 300;" align="center">
            <span style="font-weight: bold;">Research Focus:</span> ${Data['research focus']}
        </div>
    ` : " ";
    let about = Data['about'] ? `
        <div style="margin-top: 12px; font-size: 12px;" align="center">
            ${Data['about']}
        </div>
    ` : " ";

    let mid = img + name + batch + dept + research + about;

    return intro + mid + outro;
}

function FuncFinder(x) {
    let funct = x[0];
    let arg = x.length > 1 ? x.slice(1) : [];  // Ensure that `arg` is not empty

    switch (funct.toLowerCase()) {
        case 'divider':
            return `
            <div style="width: 100%; box-sizing: border-box; padding: 0 20px;">
                <hr style="height: 1px; background-color: #000000; margin: 10px 0; border-style: none;">
            </div>
            `;
        case 'title':
            return `
            <h2 style="font-weight: 200; font-size: 15px; margin: 0;" align="center">${arg[0]}</h2>
            `;
        case 'topic':
            return `
            <div style="max-width: 400px; margin: 0 auto;" align="center">
                <h1 style="margin-top: 5px;">${arg[0]}</h1>
            </div>
            `;
        case 'body':
            let intro = `
            <div style="margin-bottom: 30px;" align="center">
            `;
            let content = ContentBody(arg);
            let outro = '</div>';

            return intro + content + outro;
        case 'info':
            let intro1 = `
            <div class="event-details" style="max-width: 370px; border-radius: 10px; background-color: #f9f9f9; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); margin: 0 auto 30px; padding: 15px;">
                <table style="width: 100%;">
            `;
            let content1 = Pointers(arg);
            let outro1 = `
                </table>
            </div>
            `;

            return intro1 + content1 + outro1;
        case 'rectangle':
            return RectangleItems(arg);
    }
}

let intro = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ScriptIT</title>

</head>
<body style="font-family: 'Montserrat', Arial, sans-serif;position: relative;min-height: 100vh;box-sizing: border-box;margin: 0;padding: 0;background-color: #ffffff !important;text-align: center;" bgcolor="#ffffff">
    <div class="container" style="max-width: 800px; background-color: #ffffff !important; margin: 0 auto; padding: 20px; text-align: center;">
        <!-- Header -->
        <div class="header" style="background-color: #ffffff !important; padding: 20px; text-align: center;" align="center">
            <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                <tr>
                    <td align="center">
                        <table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                            <tr>
                                <td style="padding-right: 10px;">
                                    <img src="https://lh3.googleusercontent.com/d/1AFU313e6kOMiDIzLbvxOzQak8LBs4qJM" width="36" height="36" alt="Icon" style="fill: currentColor;">
                                </td>
                                <td>
                                    <table cellpadding="0" cellspacing="0" border="0">
                                        <tr>
                                            <td>
                                                <h1 style="font-size: 36.4px; font-family: 'Montserrat', sans-serif; margin: 0; line-height: 1;">
                                                    <span style="font-weight: 50;">Script</span><em style="font-weight: 950;">IT</em>
                                                </h1>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <p style="font-size: 5.2px; line-height: 1; margin: 0;">the CODING CLUB</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </div>

        <!-- Divider -->
        <div style="width: 100%; box-sizing: border-box; padding: 0 20px;">
            <hr style="height: 1px; background-color: #000000; margin: 10px 0; border-style: none;">
        </div>

        <!-- Main Content -->
        <div class="content" style="padding: 20px 0; background-color: #ffffff !important; text-align: center;">

<!------- Pre-written text above. ------->

`;
let outro = `

<!------- Pre-written text below. ------->

        </div>
    </div>

    <!-- Footer -->
    <div style="width: 100%; background-color: #000000;">
        <div class="u-row-container" style="padding: 0px; width: 100%;">
            <div class="u-row" style="margin: 0 auto; min-width: 320px; max-width: 800px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <!-- Logo Section -->
                        <td class="u-col footer-col" style="width: 33.33%; vertical-align: top; padding: 20px 10px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <img src="https://lh3.googleusercontent.com/d/1LiY7elKWHnZ4vuuJI6LUyQl9xAVnnkGg" alt="Logo Colour" width="170" style="display: block; margin: 0 auto;">
                                    </td>
                                </tr>
                            </table>
                        </td>

                        <!-- About Us Section -->
                        <td class="u-col footer-col" style="width: 33.33%; vertical-align: top; padding: 20px 10px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <h4 style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0 0 8px;">About Us</h4>
                                        <p style="color: #ffffff; font-size: 14px; line-height: 1.4; margin: 0;">Society of Computing, Research and Innovation in Programming and Technology of IISER Thiruvananthapuram or Script<em>IT</em>, as we call it, is a student-run open Coding Club at the Indian Institute of Science Education and Research, Thiruvananthapuram.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>

                        <!-- Contact Us Section -->
                        <td class="u-col footer-col" style="width: 33.33%; vertical-align: top; padding: 20px 10px;">
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <h4 style="color: #ffffff; font-size: 18px; font-weight: 600; margin: 0 0 8px;">Contact Us</h4>
                                        <p style="color: #ffffff; font-size: 14px; line-height: 1.4; margin: 0;">We don't have an official email yet. Please contact us via our WhatsApp group.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>

</body>
</html>

`;

function generateHTMLFromInput(input) {
    const parsedCode = parseAndCleanScript(input);
    let content = '';
    for (let item of parsedCode) {
        if (Array.isArray(item)) {
            content += FuncFinder(item);
        }
    }
    return intro + content + outro;
}

function showNotification(message, duration = 3000) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, duration);
}

// Add event listeners when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const generateBtn = document.getElementById('generate');
    const copyBtn = document.getElementById('copy');
    
    let generatedHTML = '';

    generateBtn.addEventListener('click', () => {
        const inputScript = editor.value;
        try {
            generatedHTML = generateHTMLFromInput(inputScript);
            showNotification('HTML generated successfully! Click "Copy" to copy to clipboard.');
        } catch (error) {
            showNotification('Error generating HTML: ' + error.message, 5000);
        }
    });

    copyBtn.addEventListener('click', async () => {
        if (!generatedHTML) {
            showNotification('Please generate HTML first!');
            return;
        }

        try {
            await navigator.clipboard.writeText(generatedHTML);
            showNotification('HTML copied to clipboard!');
        } catch (err) {
            showNotification('Failed to copy to clipboard');
        }
    });
});

export { generateHTMLFromInput };
