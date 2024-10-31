// EditWorkoutModal.js
import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';

export default function EditWorkoutModal({ show, handleClose, workout, onUpdate }) {
    const [name, setName] = useState(workout.name);
    const [duration, setDuration] = useState(workout.duration);
    const notyf = new Notyf();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const workoutData = { name, duration };

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/updateWorkout/${workout._id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(workoutData),
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error response:', errorData);
                throw new Error('Failed to edit workout. Please try again.');
            }

            const data = await response.json();
            notyf.success(data.message || 'Workout edited successfully');
            onUpdate(); // Call update function to refresh the workout list
            handleClose(); // Close modal after success
        } catch (error) {
            console.error('Error editing workout:', error);
            notyf.error(error.message || 'Failed to edit workout. Please try again.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Workout</Modal.Title>
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
                        Edit Workout
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
