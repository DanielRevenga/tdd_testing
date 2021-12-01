const { expect } = require("@jest/globals");
const { Room, Booking, totalOccupancyPercentage, 
    availableRooms}  = require("./index");

let room = new Room("room", 100, 0);
let date = new Date();
// Room - isOccupied
test("Room - isOccupied - not occupied, no bookings", () => {
    expect(room.isOccupied(date)).toBeFalsy();
});

test("Room - isOccupied - not occupied, bookings", () => { 
    booking = new Booking("bookingName", "test@email", "2022/12/20", "2022/12/30", 0, room);
    booking2 = new Booking("booking2Name", "test2@email", "2022/12/20", "2022/12/30", 0, room);
    booking3 = new Booking("booking3Name", "test3@email", "2022/12/20", "2022/12/30", 0, room);
    bookings = [booking, booking2, booking3];
    room.bookings = bookings;

    expect(room.isOccupied(date)).toBeFalsy();
});

test("Room - isOccupied - occupied 1 booking", () => {
    booking = new Booking("bookingName", "test@email", "2022/12/20", "2022/12/30", 0, room);
    bookings = [booking];
    room.bookings = bookings;
    date = "2022/12/25";

    expect(room.isOccupied(date)).toBeTruthy();
});

test("Room - isOccupied - occupied 1+ booking", () => {
    booking = new Booking("bookingName", "test@email", "2023/12/20", "2023/12/30", 0, room);
    booking2 = new Booking("bookingName", "test@email", "2022/12/20", "2022/12/30", 0, room);
    bookings = [booking, booking2];
    room.bookings = bookings;
    date = "2022/12/25";
    
    expect(room.isOccupied(date)).toBeTruthy();
});

// -------------------------------------------

// Room - occupancyPercentage
let startDate = "2022/12/11";
let endDate = "2022/12/30";
let booking = new Booking("bookingName", "test@email", startDate, endDate, 0, room);
let booking2 = new Booking("booking2Name", "test2@email", startDate, endDate, 0, room);
let booking3 = new Booking("booking3Name", "test3@email", startDate, endDate, 0, room);
let booking4 = new Booking("booking4Name", "test4@email", startDate, endDate, 0, room);
let bookings = [booking, booking2, booking3, booking4];
test("Room - occupancyPercentage - 1 basic booking", () => {
    room.bookings = [new Booking("bookingName", "test@email", "2022/12/21", "2022/12/30", 0, room)];
    
    expect(room.occupancyPercentage(startDate, endDate)).toBe(50);
});

test("Room - occupancyPercentage - middle empty days, not overlap", () => {
    booking = new Booking("bookingName", "test@email", "2022/12/21", "2022/12/23", 0, room);
    booking2 = new Booking("bookingName", "test@email", "2022/12/26", "2022/12/30", 0, room);
    room.bookings = [booking, booking2];

    expect( parseFloat(room.occupancyPercentage("2022/12/01", "2022/12/30").toFixed(2)) ).toBe(26.67);
});

test("Room - occupancyPercentage - multiple bookings, overlap", () => {
    booking = new Booking("bookingName", "test@email", "2022/12/11", "2022/12/25", 0, room);
    booking2 = new Booking("booking2Name", "test2@email", "2022/12/22", "2022/12/30", 0, room);
    booking3 = new Booking("booking3Name", "test3@email", "2022/12/20", "2022/12/27", 0, room);
    room.bookings = [booking, booking2, booking3];
    
    expect(parseFloat(room.occupancyPercentage("2022/12/01", "2022/12/30").toFixed(2))).toBeCloseTo(66.67);
});

test("Room - occupancyPercentage - middle empty days, overlap", () => {
    booking = new Booking("bookingName", "test@email", "2022/12/01", "2022/12/05", 0, room);
booking2 = new Booking("bookingName", "test@email", "2022/11/11", "2022/11/18", 0, room);
booking3 = new Booking("bookingName", "test@email", "2022/11/15", "2022/11/20", 0, room);
    room.bookings = [booking, booking2, booking3];

    expect( room.occupancyPercentage("2022/11/01", "2022/12/30") ).toBe(25);
});

test("Room - occupancyPercentage - simple case 0%", () => {
    room.bookings = [];

    expect(room.occupancyPercentage("2022/12/01", "2022/12/30")).toBe(0);
});

test("Room - occupancyPercentage - simple case 100%", () => {
    booking = new Booking("bookingName", "test@email", "2022/12/01", "2022/12/23", 0, room);
    booking2 = new Booking("bookingName", "test@email", "2022/12/24", "2022/12/30", 0, room);
    room.bookings = [booking, booking2];

    expect(room.occupancyPercentage("2022/12/01", "2022/12/30")).toBe(100);
});
// -------------------------------------------

// Booking - getFee()
booking = new Booking("testName", "test@email", "20/12/2021", "30/12/2021", 0, room);

test("Booking - getFee - no discounts", () => {    
    expect(booking.getFee()).toBe(100);
});

test("Booking - getFee - room discount 10%", () => {
    booking.room.discount=10;
    expect(booking.getFee()).toBe(90);
});

test("Booking - getFee - guest discount 50%", () => {
    booking.room.discount=0;
    booking.discount=50;
    expect(booking.getFee()).toBe(50);
});

test("Booking - getFee - guest and room discount (10%+50%)", () => {
    booking.room.discount=50;
    booking.discount=10;
    expect(booking.getFee()).toBe(45);
});
// -------------------------------------------

// ... - totalOccupancyPercentage
room = new Room("room1Name", 100, 0);
let room2 = new Room("room2Name", 200, 20);
let room3 = new Room("room3Name", 300, 30);
let room4 = new Room("room4Name", 400, 40);
let rooms = [room2, room3, room4];

test("... - totalOccupancyPercentage - middle empty days", () => {
    booking = new Booking("bookingName", "test@email", "2022/11/01", "2022/11/05", 0, room);
    booking2 = new Booking("booking2Name", "test2@email", "2022/11/02", "2022/11/06", 0, room);
    booking3 = new Booking("booking3Name", "test3@email", "2022/12/21", "2022/12/29", 0, room);
    bookings = [booking, booking2, booking3];
    room.bookings = bookings;

    expect(totalOccupancyPercentage([room], "2022/11/01", "2022/12/30")).toBe(25);
});

test("... - totalOccupancyPercentage - 2 rooms 1 week, 100%", () => {
    booking = new Booking("bookingName", "test@email", "2022/11/01", "2022/12/30", 0, room);
    booking2 = new Booking("booking2Name", "test2@email", "2022/11/02", "2022/12/30", 0, room);
    booking3 = new Booking("booking3Name", "test3@email", "2022/12/21", "2022/12/30", 0, room);
    bookings = [booking, booking2, booking3];
    room.bookigns = bookings;

    booking = new Booking("bookingName", "test@email", "2022/12/01", "2022/12/30", 0, room2);
    booking2 = new Booking("booking2Name", "test2@email", "2022/11/11", "2022/12/30", 0, room2);
    booking3 = new Booking("booking3Name", "test3@email", "2022/11/19", "2022/12/30", 0, room2);
    bookings = [booking, booking2, booking3];
    room2.bookings = bookings;

    expect(totalOccupancyPercentage([room , room2], "2022/12/21", "2022/12/26")).toBe(100);
});

test("... - totalOccupancyPercentage - 2 rooms 1 week, 0%", () => {
    let room = new Room("fdf", 0, 0);
    booking = new Booking("bookingName", "test@email", "2022/11/01", "2022/11/30", 0, room);
    booking2 = new Booking("booking2Name", "test2@email", "2022/11/02", "2022/11/30", 0, room);
    booking3 = new Booking("booking3Name", "test3@email", "2022/11/21", "2022/11/30", 0, room);
    const bookings = [booking, booking2, booking3];
    room.bookigns = bookings;

    let room2 = new Room("fdf", 0, 0);
    booking = new Booking("bookingName", "test@email", "2022/11/01", "2022/11/30", 0, room2);
    booking2 = new Booking("booking2Name", "test2@email", "2022/11/11", "2022/11/30", 0, room2);
    booking3 = new Booking("booking3Name", "test3@email", "2022/11/19", "2022/11/30", 0, room2);
    const bookings2 = [booking, booking2, booking3];
    room2.bookings = bookings2;
    
    expect(totalOccupancyPercentage([room , room2], "2022/12/11", "2022/12/26")).toBe(0);
});

// -------------------------------------------

// ... - availableRooms
test("... - availableRooms - all rooms occupied", () => {
    let room = new Room("roomName", 0, 0);
    booking = new Booking("bookingName", "test@email", "2022/11/01", "2022/11/30", 0, room);
    booking2 = new Booking("booking2Name", "test2@email", "2022/11/02", "2022/11/30", 0, room);
    booking3 = new Booking("booking3Name", "test3@email", "2022/11/21", "2022/11/30", 0, room);
    const bookings = [booking, booking2, booking3];
    room.bookigns = bookings;

    let room2 = new Room("room2Name", 0, 0);
    booking = new Booking("bookingName", "test@email", "2022/11/01", "2022/11/30", 0, room2);
    booking2 = new Booking("booking2Name", "test2@email", "2022/11/06", "2022/11/10", 0, room2);
    booking3 = new Booking("booking3Name", "test3@email", "2022/11/19", "2022/11/30", 0, room2);
    const bookings2 = [booking, booking2, booking3];
    room2.bookings = bookings2;

    expect(availableRooms([room, room2], "2022/11/06", "2022/11/10" )).toMatchObject([]);
});

test("... - availableRooms - no rooms occupied", () => {
    let room = new Room("roomName", 0, 0);
    booking = new Booking("bookingName", "test@email", "2022/11/01", "2022/11/30", 0, room);
    booking2 = new Booking("booking2Name", "test2@email", "2022/11/02", "2022/11/30", 0, room);
    booking3 = new Booking("booking3Name", "test3@email", "2022/11/21", "2022/11/30", 0, room);
    const bookings = [booking, booking2, booking3];
    room.bookigns = bookings;

    let room2 = new Room("room2Name", 0, 0);
    booking = new Booking("bookingName", "test@email", "2022/11/01", "2022/11/30", 0, room2);
    booking2 = new Booking("booking2Name", "test2@email", "2022/11/11", "2022/11/30", 0, room2);
    booking3 = new Booking("booking3Name", "test3@email", "2022/11/19", "2022/11/30", 0, room2);
    const bookings2 = [booking, booking2, booking3];
    room2.bookings = bookings2;

    expect(availableRooms([room, room2], "2022/01/01", "2022/01/10" )).toMatchObject([room, room2]);
});

test("... - availableRooms - 1 month, 50%", () => {
    let room = new Room("roomName", 0, 0);
    booking = new Booking("bookingName", "test@email", "2022/12/01", "2022/12/30", 0, room);
    booking2 = new Booking("booking2Name", "test2@email", "2022/12/02", "2022/12/30", 0, room);
    booking3 = new Booking("booking3Name", "test3@email", "2022/12/21", "2022/12/30", 0, room);
    const bookings = [booking, booking2, booking3];
    room.bookigns = bookings;

    let room2 = new Room("room2Name", 0, 0);
    booking = new Booking("bookingName", "test@email", "2022/11/01", "2022/11/30", 0, room2);
    booking2 = new Booking("booking2Name", "test2@email", "2022/11/11", "2022/11/30", 0, room2);
    booking3 = new Booking("booking3Name", "test3@email", "2022/11/19", "2022/11/30", 0, room2);
    const bookings2 = [booking, booking2, booking3];
    room2.bookings = bookings2;

    expect(availableRooms([room, room2], "2022/11/01", "2022/11/10" )).toMatchObject([room]);
});

// -------------------------------------------


