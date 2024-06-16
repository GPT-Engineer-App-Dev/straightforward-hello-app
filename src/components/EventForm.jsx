import React, { useState, useEffect } from 'react';
import { VStack, FormControl, FormLabel, Input, Button, Select } from '@chakra-ui/react';
import { useVenues } from '../integrations/supabase/index.js';

const EventForm = ({ onSubmit, event }) => {
    const { data: venues } = useVenues();
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        venue: ''
    });

    useEffect(() => {
        if (event) {
            setFormData({
                name: event.name || '',
                date: event.date || '',
                venue: event.venue || ''
            });
        }
    }, [event]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ name: '', date: '', venue: '' });
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
                <FormControl id="name" isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input name="name" value={formData.name} onChange={handleChange} />
                </FormControl>
                <FormControl id="date" isRequired>
                    <FormLabel>Date</FormLabel>
                    <Input type="date" name="date" value={formData.date} onChange={handleChange} />
                </FormControl>
                <FormControl id="venue" isRequired>
                    <FormLabel>Venue</FormLabel>
                    <Select name="venue" value={formData.venue} onChange={handleChange}>
                        <option value="">Select venue</option>
                        {venues && venues.map(venue => (
                            <option key={venue.id} value={venue.id}>{venue.name}</option>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" colorScheme="blue">{event ? 'Update' : 'Add'} Event</Button>
            </VStack>
        </form>
    );
};

export default EventForm;