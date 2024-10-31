import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function AddWorkoutModal({ show, handleClose }) {
    const [name, setName] = useState('');
    const [duration, setDuration] = useState('');
    const notyf = new Notyf();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Log the workout data being added
        const workoutData = { name, duration };
        console.log('Adding workout data:', workoutData);

        try {
            const token = localStorage.getItem('token'); // Get the token

            const response = await fetch('https://fitnessapp-api-ln8u.onrender.com/workouts/addWorkout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include the token
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoutData),
            });

            if (!response.ok) {
                const errorData = await response.text(); // Get raw response text for better debugging
                console.error('Error response:', errorData);
                throw new Error('Failed to add workout. Please try again.'); // Simplified message
            }

            const data = await response.json();
            console.log('Workout added successfully:', data); // Log the response data
            notyf.success(data.message || 'Workout added successfully');
            handleClose(); // Close modal after success
            setName('');
            setDuration('');
        } catch (error) {
            console.error('Error adding workout:', error);
            notyf.error(error.message || 'Failed to add workout. Please try again.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add Workout</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="workoutName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter workout name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="workoutDuration">
                        <Form.Label>Duration</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Add Workout
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
