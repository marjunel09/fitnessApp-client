import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import AddWorkoutModal from '../components/AddWorkoutModal';
import EditWorkoutModal from '../components/EditWorkoutModal';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useNavigate } from 'react-router-dom';
import './Workout.css';

function Workouts() {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const notyf = new Notyf();
    const navigate = useNavigate(); // Initialize useNavigate for navigation

    const fetchWorkouts = async () => {
        const token = localStorage.getItem('token');
        const response = await fetch('https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        setWorkouts(data.workouts);
        setLoading(false);
    };

    useEffect(() => {
        fetchWorkouts();
    }, []);

    const handleAddWorkout = () => setShowAddModal(true);
    const handleEditWorkout = (workout) => {
        setSelectedWorkout(workout);
        setShowEditModal(true);
    };
    const handleCloseAddModal = () => setShowAddModal(false);
    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedWorkout(null);
    };
    const handleUpdate = () => {
        fetchWorkouts();
    };

    const handleDeleteWorkout = async (workoutId) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/deleteWorkout/${workoutId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error response:', errorData);
                throw new Error('Failed to delete workout. Please try again.');
            }

            notyf.success('Workout deleted successfully');
            handleUpdate();
        } catch (error) {
            console.error('Error deleting workout:', error);
            notyf.error(error.message || 'Failed to delete workout. Please try again.');
        }
    };

    if (loading) return <div className="text-center">Loading...</div>; // Centered loading text

    const isLoggedIn = localStorage.getItem('token');

    return (
        <div className="container mt-4 ">
            <h2 className="text-center mb-4">Your Workouts</h2>
            {isLoggedIn ? (
                <>
                    <div className="d-flex justify-content-center mb-3">
                        <Button variant="primary" onClick={handleAddWorkout} className="custom-button">
                            Add Workout
                        </Button>
                    </div>
                    <Row>
                        {Array.isArray(workouts) && workouts.length > 0 ? (
                            workouts.map((workout) => (
                                <Col md={4} key={workout._id} className="mb-3">
                                    <Card className="shadow-sm rounded workout-card">
                                        <Card.Body>
                                            <Card.Title>{workout.name}</Card.Title>
                                            <Card.Text>
                                                <strong>Duration:</strong> {workout.duration}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Status:</strong> {workout.status}
                                            </Card.Text>
                                            <div className="d-flex justify-content-between">
                                                <Button className="custom-button" onClick={() => handleEditWorkout(workout)}>
                                                    Edit Workout
                                                </Button>
                                                <Button className="custom-button" onClick={() => handleDeleteWorkout(workout._id)}>
                                                    Delete Workout
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <Col className="text-center">
                                <p>No workouts available. Please add some workouts.</p>
                            </Col>
                        )}
                    </Row>
                </>
            ) : (
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: 'calc(100vh - 200px)', textAlign: 'center' }}>
                    <p>Please log in to view your workouts.</p>
                    <Button className="custom-button" onClick={() => navigate('/login')}>
                        Go to Login
                    </Button>
                </div>
            )}


            {/* Add Workout Modal */}
            <AddWorkoutModal show={showAddModal} handleClose={handleCloseAddModal} />
            {/* Edit Workout Modal */}
            {selectedWorkout && (
                <EditWorkoutModal
                    show={showEditModal}
                    handleClose={handleCloseEditModal}
                    workout={selectedWorkout}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
}

export default Workouts;
