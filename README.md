# Filler - HTML Generator

**Filler v1.0 - HTML Generator** is a web-based tool created by ScriptIT, the Coding Club of IISER Thiruvananthapuram. It is designed to convert custom Filler script into formatted HTML content quickly and easily. This tool simplifies the process of creating structured HTML content for events, announcements, and other communications, allowing you to focus on content creation rather than manual coding.

---

## Updates in Progress:
- Hosting of images used in the header and footer is being shifted from Google Drive to GitHub for better reliability.
- Optimized algorithms for faster HTML generation are under development.
- Additional basic functions (e.g., new formatting tags) are being implemented.
- Support for narrow screens and smaller devices is being added for better responsiveness.
- Improvements to user notifications and error handling are being worked on.

---

## Features

- **Filler Script Conversion**: Convert custom Filler script into clean, formatted HTML.
- **Simple Interface**: Easy-to-use editor for writing scripts and generating HTML content.
- **Preview**: See a live preview of the generated HTML before finalizing.
- **Download/Copy**: Copy the HTML to your clipboard or download it as a file for use in your projects.
- **Help & Documentation**: In-app help icon (?) for quick access to the user guide and scripting references.

---

## How to Use

1. **Write Your Script**: 
   - Use the editor to write your content using the Filler scripting language.
   - Refer to the user guide for syntax and examples.

2. **Generate HTML**:
   - Click "Generate HTML" to convert your script into the corresponding HTML content.

3. **Copy/Download**:
   - Use the "Copy to Clipboard" button to quickly copy the HTML code to your clipboard.
   - Or click "Download HTML" to save the generated HTML to your local device.

4. **Get Help**:
   - Click the help icon (?) for detailed documentation and guidance on using the tool.

---

## Credits

This tool leverages **CodeMirror** for the editor functionality, providing syntax highlighting, auto-indentation, and a seamless editing experience. Visit [CodeMirror's official website](https://codemirror.net/) for more information.

---

### Basic Structure

The Filler script follows a simple structure for creating HTML content. Use the following commands to define different sections of your content:

- **title{...}**: Defines the title of the content.
- **topic{...}**: Defines the main topic.
- **body{...}**: Contains the body text of your content.
- **info{...}**: Displays event details such as date, time, and venue.
- **rectangle{...}**: Used for creating speaker cards with images, names, and additional details.
- **divider{}**: Adds a horizontal line divider in the content.

For more advanced uses, refer to the syntax guide within the application.

---

## Example Script

```plaintext
title{Alumni Discussion}

topic{Unix and their Advantages Over Windows}

body{
    After the gruelling exam season, we hope all of you get to enjoy the vacation in peace (hopefully). We are happy with the success of the last event, so to continue the trend we are hosting another event,
    
    bigbold{A Webinar!}
    
    Don't worry, you won't miss out on the fun. It's a webinar, it's online. We hope to see you attend it! :D
}

info{
    Date: 17-12-24
    Time: 2200 Hours
    Venue: LHC Venus
    Speakers: Sanjay Kritic
}

rectangle{
    image: https://picsum.photos/700/700/
    name: Sanjay Kritic
    Batch: 2019
    Dept: Faculty of IIT Dholakpur
    Research Focus: Quantum Information and Computation
    About: This is a guy. Nice. He likes Game Of Thrones Season 7. I don't like him.
}

divider{}

body{
    bold{
        Don't miss this opportunity to:
    }
    pointers{
        Interact with the alumni
        Potential internships info
        Learn new things
        Have fun!! :D
    }
    We can't wait to see you there!
}
