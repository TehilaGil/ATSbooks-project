import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";


const EnglishCourseSignUp = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    schoolName: "",
    email: "",
    grade: null,
    audioFile: null,
  });

  const grades = [
    { label: "1st Grade", value: "1st Grade" },
    { label: "2nd Grade", value: "2nd Grade" },
    { label: "3rd Grade", value: "3rd Grade" },
    { label: "4th Grade", value: "4th Grade" },
    { label: "5th Grade", value: "5th Grade" },
    { label: "6th Grade", value: "6th Grade" },
    { label: "7th Grade", value: "7th Grade" },
    { label: "8th Grade", value: "8th Grade" },
    { label: "9th Grade", value: "9th Grade" },
    { label: "10th Grade", value: "10th Grade" },
    { label: "11th Grade", value: "11th Grade" },
    { label: "12th Grade", value: "12th Grade" },
  ];

  const handleInputChange = (e, field) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", form);
    alert("Thank you for signing up! We'll get back to you soon.");
  };

  return (
    <div className="signup-form-container">
      <h1 className="signup-title">💌 Welcome to the English Course!</h1>
      <p className="signup-subtitle">
        Let's get to know you better so we can help you shine 💫
      </p>
      <div className="signup-form">
        {/* First Name */}
        <div className="form-field">
          <label htmlFor="firstName" className="cute-label">
            What's your first name? 🌟
          </label>
          <InputText
            id="firstName"
            placeholder="Type your first name"
            value={form.firstName}
            onChange={(e) => handleInputChange(e, "firstName")}
            className="cute-input"
          />
        </div>

        {/* Last Name */}
        <div className="form-field">
          <label htmlFor="lastName" className="cute-label">
            And your last name? 🌈
          </label>
          <InputText
            id="lastName"
            placeholder="Type your last name"
            value={form.lastName}
            onChange={(e) => handleInputChange(e, "lastName")}
            className="cute-input"
          />
        </div>

        {/* School Name */}
        <div className="form-field">
          <label htmlFor="schoolName" className="cute-label">
            Where do you study? 🏫
          </label>
          <InputText
            id="schoolName"
            placeholder="Your school's name"
            value={form.schoolName}
            onChange={(e) => handleInputChange(e, "schoolName")}
            className="cute-input"
          />
        </div>

        {/* Email */}
        <div className="form-field">
          <label htmlFor="email" className="cute-label">
            What's your email? 📧
          </label>
          <InputText
            id="email"
            placeholder="Type your email address"
            value={form.email}
            onChange={(e) => handleInputChange(e, "email")}
            className="cute-input"
          />
        </div>

        {/* Grade */}
        <div className="form-field">
          <label htmlFor="grade" className="cute-label">
            What grade are you in? 🎓
          </label>
          <Dropdown
            id="grade"
            value={form.grade}
            options={grades}
            onChange={(e) => handleInputChange(e, "grade")}
            placeholder="Select your grade"
            className="cute-dropdown"
          />
        </div>

        {/* Audio Upload */}
        <div className="form-field">
          <label htmlFor="audio" className="cute-label">
            I just want to know your level, so please record a 1-minute audio
            for me 🎤
          </label>
          <FileUpload
            mode="basic"
            name="audioFile"
            accept="audio/*"
            customUpload
            auto
            chooseLabel="Click to record/upload"
            uploadHandler={(e) => setForm((prev) => ({ ...prev, audioFile: e.files[0] }))}
            className="cute-upload"
          />
        </div>

        {/* Submit Button */}
        <div className="form-field">
          <Button
            label="Sign me up! 🎉"
            icon="pi pi-send"
            className="cute-button"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default EnglishCourseSignUp;