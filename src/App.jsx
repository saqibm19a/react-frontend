import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Container,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import './App.css';

const API_URL = 'https://express-backend-beta.vercel.app/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [open, setOpen] = useState(false); // For controlling the add user dialog visibility
  const [editOpen, setEditOpen] = useState(false); // For controlling the edit user dialog visibility

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Add a new user
  const addUser = async () => {
    try {
      const response = await axios.post(API_URL, newUser);
      setUsers([...users, response.data.newUser]);
      setNewUser({ name: '', email: '' });
      handleClose(); // Close the add dialog after adding user
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Update an existing user
  const updateUser = async () => {
    try {
      const response = await axios.put(`${API_URL}/${editingUser.id}`, editingUser);
      setUsers(users.map(user => (user.id === editingUser.id ? response.data.updatedUser : user)));
      setEditingUser(null);
      handleEditClose(); // Close the edit dialog after updating user
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Handle form input change for adding/editing users
  const handleInputChange = (e, setFunction) => {
    setFunction(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Open add user dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close add user dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Open edit user dialog
  const handleEditOpen = (user) => {
    setEditingUser(user);
    setEditOpen(true);
  };

  // Close edit user dialog
  const handleEditClose = () => {
    setEditOpen(false);
    setEditingUser(null);
  };

  // Delete user function
const deleteUser = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    setUsers(users.filter((user) => user.id !== id));
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};


  return (
    <Container>
      <Typography variant="h3" gutterBottom>
        User Management
      </Typography>

      <Box component="div" sx={{ mb: 4 }}>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Add User
        </Button>

        {/* Add User Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Add a New User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please enter the details for the new user.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              name="name"
              value={newUser.name}
              onChange={(e) => handleInputChange(e, setNewUser)}
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              value={newUser.email}
              onChange={(e) => handleInputChange(e, setNewUser)}
              fullWidth
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={addUser} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Typography variant="h5" gutterBottom>
        Users List
      </Typography>

      {/* Users Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align="right">
                    <IconButton aria-label="edit" onClick={() => handleEditOpen(user)}>
                      <Edit />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => deleteUser(user.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit User Dialog */}
      {editingUser && (
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Please update the details for the user.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              name="name"
              value={editingUser.name}
              onChange={(e) => handleInputChange(e, setEditingUser)}
              fullWidth
              variant="outlined"
            />
            <TextField
              margin="dense"
              label="Email"
              name="email"
              value={editingUser.email}
              onChange={(e) => handleInputChange(e, setEditingUser)}
              fullWidth
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={updateUser} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
}

export default App;
