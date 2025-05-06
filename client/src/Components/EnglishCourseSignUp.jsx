import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { AudioRecorder } from "react-audio-voice-recorder";
import { ProgressSpinner } from "primereact/progressspinner";

const EnglishCourseSignUp = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    schoolName: "",
    email: "",
    grade: null,
    audioFile: null,
  });

  const [recordingBlob, setRecordingBlob] = useState(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverResponse, setServerResponse] = useState(null);

  const grades = [...Array(12)].map((_, i) => ({
    label: `${i + 1}th Grade`,
    value: `${i + 1}th Grade`,
  }));

  const handleInputChange = (e, field) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const SentRequestForJoinTheCourse = async () => {
    setSubmitted(true);

    if (
      !form.firstName ||
      !form.lastName ||
      !form.schoolName ||
      !form.email ||
      !form.grade ||
      !form.audioFile
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setLoading(true); // Show loading spinner

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      const response = await fetch("http://localhost:7000/api/course", {
        method: "POST",
        body: formData,
      });

      const result = await response.json(); // Extract JSON response from server

      if (response.ok) {
        setServerResponse(result); // Save the response for display
      } else {
        alert("There was a problem sending your request. ❌");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error sending request ❗");
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  const addAudioElement = (blob) => {
    setRecordingBlob(blob);
    setForm((prev) => ({ ...prev, audioFile: new File([blob], "audio.webm") }));
    setShowAudioPlayer(true);
  };

  return (
    <div className="signup-form-container">
      <h1 className="signup-title">💌 Welcome to the English Course!</h1>
      <p className="signup-subtitle">
        Let's get to know you better so we can help you shine 💫
      </p>

      <div className="signup-form">
        {[["firstName", "What's your first name? 🌟"],
          ["lastName", "And your last name? 🌈"],
          ["schoolName", "Where do you study? 🏫"],
          ["email", "What's your email? 📧"],
        ].map(([field, label]) => (
          <div className="form-field" key={field}>
            <label htmlFor={field} className="cute-label">
              {label}
            </label>
            <InputText
              id={field}
              placeholder={`Type your ${field}`}
              value={form[field]}
              onChange={(e) => handleInputChange(e, field)}
              className={`cute-input ${submitted && !form[field] ? "p-invalid" : ""}`}
            />
            {submitted && !form[field] && (
              <small className="p-error">This field is required</small>
            )}
          </div>
        ))}

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
            className={`cute-dropdown ${submitted && !form.grade ? "p-invalid" : ""}`}
          />
          {submitted && !form.grade && (
            <small className="p-error">This field is required</small>
          )}
        </div>

        <div className="form-field">
          <label className="cute-label">
            I just want to know your level, so please record a 1-minute audio
            for me 🎤
          </label>

          <AudioRecorder
            onRecordingComplete={(blob) => addAudioElement(blob)}
            audioTrackConstraints={{ noiseSuppression: true, echoCancellation: true }}
            showVisualizer
            downloadOnSavePress={false}
            downloadFileExtension="webm"
            mediaRecorderOptions={{ maxLengthInSeconds: 60 }}
          />

          {showAudioPlayer && recordingBlob && (
            <div style={{ marginTop: "1rem" }}>
              <p className="cute-label">🎧 Listen to your recording:</p>
              <audio controls src={URL.createObjectURL(recordingBlob)} />
            </div>
          )}

          {submitted && !form.audioFile && (
            <small className="p-error">Please record your audio</small>
          )}
        </div>

        <div className="form-field">
          <Button
            label="Sign me up! 🎉"
            icon="pi pi-send"
            className="cute-button"
            onClick={SentRequestForJoinTheCourse}
          />
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <ProgressSpinner />
          <p>Your request is being processed...</p>
        </div>
      )}

      {serverResponse && (
        <div className="response-container">
          <h2>Thank you for signing up! 🎉</h2>
          <p>
            <strong>Name:</strong> {serverResponse.firstName}
          </p>
          <p>
            <strong>Level:</strong> {serverResponse.level}
          </p>
          <p>
            <strong>Feedback:</strong> {serverResponse.feedback}
          </p>
        </div>
      )}
    </div>
  );
};

export default EnglishCourseSignUp;