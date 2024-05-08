import { useState } from "react";
import axios from "axios";
import { Form, Button, FormLabel } from "react-bootstrap";
import EditorToolbar, { formats, modules } from "./Toolbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EmailForm() {
  const [emailInput, setEmailInput] = useState("");
  const [content, setContent] = useState("");

  const [subject, setSubject] = useState("");

  const handleInputChange = (e) => {
    setSubject(e.target.value);
  };

  const mailApi = async () => {
    try {
      const emailArray = emailInput.split(",").map((email) => email.trim());
      await axios.post("https://mail-sender-1.onrender.com/api/mailer", {
        recipients: emailArray,
        html: content,
        subject: subject,
      });

      toast.success("mail sent success!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (err) {
      toast.error(err, {
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
        <FormLabel>Body of the Letter</FormLabel>
        <EditorToolbar />
        <ReactQuill
          modules={modules}
          formats={formats}
          theme="snow"
          value={content}
          onChange={(value) => setContent(value)}
        />
        <Button type="submit" className="mt-3">
          Send Emails
        </Button>
      </Form>
    </>
  );
}

export default EmailForm;
