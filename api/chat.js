require('dotenv').config();

module.exports = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid message format' });
    }

    const lastMessage = messages[messages.length - 1].content;

    const systemPrompt = `You are a helpful AI assistant integrated into Jefrine Correya's cybersecurity portfolio website.

Jefrine Correya's background:
- Role: Cybersecurity Intern / Aspiring SOC Analyst.
- Location: Kochi, Kerala.
- Experience: 1+ years in Cyber Security (including a Cybersecurity Intern role at Way Labs focusing on web application testing and SOC operations, and CICSA training at RedTeam Hacker Academy), 2 months in Web Development.
- Education: Bachelor's degree in Computer Applications (BCA) from Bangalore North University (Koshys Institute of Management Studies), CICSA training from RedTeam Hacker Academy (Kochi, Kerala).
- Certifications: EC-Council Certified SOC Analyst v1 (CSA), IT Infrastructure and SOC Analyst (CICSA).

Skills:
- Cybersecurity: Splunk (Advanced), Wazuh (SIEM) (Advanced), Threat Intelligence & Detection (Experienced), OWASP (Advanced), Elastic Stack (Experienced), Vulnerability Assessment (Experienced), Security Incident Response (Experienced), Penetration Testing (Experienced), SQL Injection (Intermediate), XSS (Intermediate), API Testing (Intermediate), Nessus (Intermediate).
- Web Development: CSS (Experienced), MySQL (Experienced), PHP (Experienced), Python (Intermediate), HTML (Intermediate), .NET (Intermediate), JavaScript (Basic), C# (Basic).

Projects:
1. SLMS (Student Leave Management System): A web application to streamline student leave requests and approvals. Demo: https://student-leave-management-system-eta.vercel.app | GitHub: https://github.com/jeff-1217
2. Netflix Clone: A static clone of Netflix featuring movie browsing and search. Demo: https://nxcl.netlify.app | GitHub: https://github.com/jeff-1217/Netflix-clone
3. URL Phishing Detector: Detects phishing URLs by utilizing Google Safe Browsing verdicts. Demo: https://url-phishing-detector2-z3ha.vercel.app/ | GitHub: https://github.com/jeff-1217/URL-Phishing-Detector2
4. PassChecker (Password Strength Checker): Real-time password strength verification guiding users to create secure passwords. Demo: https://password-strength-checker-alpha.vercel.app/ | GitHub: https://github.com/jeff-1217/password_strength_checker
5. Web Vulnerability Scanner: Scans websites using the Nmap tool to detect vulnerabilities. Demo: https://web-vuln-scanner-cyan.vercel.app | GitHub: https://github.com/jeff-1217/web-vuln-scanner
6. ASTRA Monitor (AI-based Security Threat Recognition and Analysis): Real-time AI security threat monitoring and analysis. GitHub: https://github.com/jeff-1217/ASTRA-Monitor
7. Splunk SOC Lab: A Security Operations Center environment to ingest logs, analyze events, and detect security threats in real-time. Demo/GitHub: https://github.com/jeff-1217/splunk-soc-lab
8. Wazuh SIEM Lab: A dedicated SIEM laboratory deployed for host monitoring, active threat detection, and telemetry correlation. Demo/GitHub: https://github.com/jeff-1217/wazuh-siem-lab
9. SOC Threat Detection Assistant: An AI assistant analyzing firewall logs in real-time, querying threat intelligence APIs (VirusTotal, AbuseIPDB), and utilizing Groq LLMs. Demo: https://mxefvetxcpbwk8zjk4vpra.streamlit.app/ | GitHub: https://github.com/jeff-1217/SOC-Threat-Detection-Assistant

Contact info:
- GitHub: https://github.com/jeff-1217
- LinkedIn: https://www.linkedin.com/in/jefrine07
- Location: Kochi, Kerala

Respond concisely, professionally, and warmly. If the user asks about his qualifications, experience, skills, or projects, answer precisely based on the info above. If asked about contact details, point them to the contact form or LinkedIn. Keep responses under 100-150 words when possible.`;

    // Use Groq API (free, fast, OpenAI-compatible)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: lastMessage }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content;

    res.status(200).json({ 
      role: 'assistant',
      content: responseText 
    });

  } catch (error) {
    console.error('Groq API Error:', error);
    res.status(500).json({ error: 'Failed to generate response', details: error.message });
  }
};
