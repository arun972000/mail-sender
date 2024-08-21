/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import axios from "axios";
import { Form, Button, FormLabel } from "react-bootstrap";
import EditorToolbar, { formats, modules } from "./Toolbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./mail.css"

function EmailForm() {
  const [emailInput, setEmailInput] = useState("");
  const [content, setContent] = useState(""); // Content from ReactQuill
  const [htmlContent, setHtmlContent] = useState(""); // HTML content from textarea
  const [subject, setSubject] = useState("");
  const [isTemplateMode, setIsTemplateMode] = useState(false); // Checkbox state
  const [success, setSuccess] = useState([])
  const [failure, setFailure] = useState([])
  const [delayed, setDelayed] = useState([]) // State to store email statuses
  const [loading, setLoading] = useState(false)


  const handleInputChange = (e) => {
    setSubject(e.target.value);
  };

  const handleHtmlContentChange = (e) => {
    setHtmlContent(e.target.value);
  };

  const handleModeChange = (e) => {
    const checked = e.target.checked;
    setIsTemplateMode(checked);
    // Clear content when switching modes
    if (checked) {
      setContent(""); // Clear editor content if switching to HTML input
    } else {
      setHtmlContent(""); // Clear HTML content if switching to editor
    }
  };

  const mailApi = async () => {
    try {
      const emailArray = emailInput.split(",").map((email) => email.trim());
      const payload = {
        recipients: emailArray,
        subject: subject,
        html: isTemplateMode ? htmlContent : content // Send htmlContent if in template mode, otherwise send content
      };

      const response = await axios.post("http://localhost:5000/api/mailer", payload); //https://mail-sender-1.onrender.com/api/mailer
      setLoading(false)
      if (response.data.success) {

        setSuccess(response.data.results.success)
        setFailure(response.data.results.failure)
        setDelayed(response.data.results.delay)
        toast.success("Mail sent successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error("Failed to send mail. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
    } catch (err) {
      setLoading(false)
      toast.error("Failed to send mail. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.log(err);
    }
  };

  const handleSubmit = (event) => {
    setLoading(true)
    event.preventDefault();
    mailApi();
  };

  return (
    <>
      <ToastContainer />

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="emailInput" className="mb-3">
          <Form.Label>Enter email addresses (separated by commas):</Form.Label>
          <Form.Control
            type="text"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="e.g., email1@example.com, email2@example.com"
          />
        </Form.Group>
        <div className="form-group mb-3">
          <label htmlFor="exampleFormControlInput1">Subject</label>
          <input
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Enter Subject..."
            value={subject}
            onChange={handleInputChange}
          />
        </div>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="modeCheckbox"
            label="Use Template Mode"
            checked={isTemplateMode}
            onChange={handleModeChange}
          />
        </Form.Group>

        {isTemplateMode ? (
          <Form.Group className="mb-3">
            <Form.Label>HTML Content (optional):</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={htmlContent}
              onChange={handleHtmlContentChange}
              placeholder="Enter HTML content here..."
            />
          </Form.Group>
        ) : (
          <>
            <FormLabel>Body of the Letter</FormLabel>
            <EditorToolbar />
            <ReactQuill
              modules={modules}
              formats={formats}
              theme="snow"
              value={content}
              onChange={(value) => setContent(value)}
            />
          </>
        )}

        <Button type="submit" className="mt-3" disabled={loading}>
          {loading ? "Please wait" : "Send Emails"}
        </Button>
      </Form>
      <div className="mt-3"><h4>Email Status</h4>
        {success.length !== 0 && success.map((item, i) => <li key={i} className="text-success">{item.email} - {item.status}</li>)}
        {failure.length !== 0 && failure.map((item, i) => <li key={i} className="text-danger">{item.email} - {item.status}</li>)}
        {delayed.length !== 0 && delayed.map((item, i) => <li key={i} className="text-warning">{item.email} - {item.status}</li>)}
      </div>

      <div className="user-instructions mt-4">
        <h5>User Instructions:</h5>
        <p>1. Enter email addresses separated by commas.<br/>
          2. Choose a subject for your email.<br/>
          3. Optionally, enable "Use Template Mode" to enter HTML content.<br/>
          4. If not using template mode, use the editor to craft your email content.<br/>
          5. Click "Send Emails" to dispatch your message.<br/>
          6. The list of successfully sent emails will be displayed below.</p>
      </div>
    </>
  );
}

export default EmailForm;
