import React, { useState } from 'react';
import { Container, Heading, Button, VStack, HStack, Table, Thead, Tbody, Tr, Th, Td, useToast } from '@chakra-ui/react';
import { useEvents, useAddEvent, useUpdateEvent, useDeleteEvent } from '../integrations/supabase/index.js';
import EventForm from '../components/EventForm.jsx';

const Events = () => {
    const { data: events, isLoading, isError } = useEvents();
    const addEvent = useAddEvent();
    const updateEvent = useUpdateEvent();
    const deleteEvent = useDeleteEvent();
    const toast = useToast();
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleAddEvent = async (event) => {
        try {
            await addEvent.mutateAsync(event);
            toast({ title: "Event added.", status: "success", duration: 3000, isClosable: true });
        } catch (error) {
            toast({ title: "Error adding event.", description: error.message, status: "error", duration: 3000, isClosable: true });
        }
    };

    const handleUpdateEvent = async (event) => {
        try {
            await updateEvent.mutateAsync(event);
            toast({ title: "Event updated.", status: "success", duration: 3000, isClosable: true });
            setSelectedEvent(null);
        } catch (error) {
            toast({ title: "Error updating event.", description: error.message, status: "error", duration: 3000, isClosable: true });
        }
    };

    const handleDeleteEvent = async (id) => {
        try {
            await deleteEvent.mutateAsync(id);
            toast({ title: "Event deleted.", status: "success", duration: 3000, isClosable: true });
        } catch (error) {
            toast({ title: "Error deleting event.", description: error.message, status: "error", duration: 3000, isClosable: true });
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading events.</div>;

    return (
        <Container maxW="container.lg" py={8}>
            <VStack spacing={4} align="stretch">
                <Heading as="h1" size="xl">Events</Heading>
                <EventForm onSubmit={selectedEvent ? handleUpdateEvent : handleAddEvent} event={selectedEvent} />
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Date</Th>
                            <Th>Venue</Th>
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {events.map(event => (
                            <Tr key={event.id}>
                                <Td>{event.name}</Td>
                                <Td>{event.date}</Td>
                                <Td>{event.venue}</Td>
                                <Td>
                                    <HStack spacing={2}>
                                        <Button size="sm" onClick={() => setSelectedEvent(event)}>Edit</Button>
                                        <Button size="sm" colorScheme="red" onClick={() => handleDeleteEvent(event.id)}>Delete</Button>
                                    </HStack>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </VStack>
        </Container>
    );
};

export default Events;