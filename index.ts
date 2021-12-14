
class Room {
    bookings = [];
    name: string;
    rate: number;
    discount: number;

    constructor(name: string, rate: number, discount: number) {
        this.name = name;
        this.rate = rate;
        this.discount = discount;
    }

    isOccupied (date: Date): boolean {
        
        if (!this.bookings || !this.bookings.length){
            return false;
        }

        for (let booking of this.bookings) {
            if (booking.isBetween(date, booking.check_in, booking.check_out)) return true;
        }

        return false;
    }

    occupancyPercentage (startDate: string, endDate: string): number {
        let iterateD = new Date(startDate);
        let occupiedDays = 0;
        const startD = new Date(startDate);
        const endD = new Date(endDate);     
        const totalDaysRange = Math.ceil( Math.abs(startD.getTime() - endD.getTime() )  
            / (1000 * 60 * 60 * 24) ) + 1;

        if (!this.bookings) return 0;

        while (iterateD <= endD) {
            for (let booking of this.bookings){           
                if (booking.isBetween(iterateD, booking.check_in, booking.check_out)){
                    occupiedDays += 1;
                    break;
                } 
            }

            iterateD.setDate(iterateD.getDate() +1);       
        }

        return (occupiedDays * 100) / totalDaysRange;
    }

} 

class Booking {
    name: string ;
    email: string ;
    check_in: string ;
    check_out: string ;
    discount: number ;
    room: Room ;

    constructor (name: string, email: string, check_in: string, check_out: string, discount: number, room: Room) {
        this.name = name;
        this.email = email;
        this.check_in = check_in;
        this.check_out = check_out;
        this.discount = discount;
        this.room = room;
    }

    getFee(): number {     
        let finalPrice = this.room.rate - ((this.room.discount * this.room.rate) / 100);
        finalPrice -= (this.discount * finalPrice) / 100;

        return finalPrice;
    }

    isBetween(date, startDate, endDate): boolean {
        date = new Date(date).getTime();        
        startDate = new Date(startDate).getTime();
        endDate = new Date(endDate).getTime();
        
        if (startDate >= endDate) return false;
        
        if (date >= startDate && date <= endDate) return true;

        return false;
    }

    
}

function totalOccupancyPercentage (rooms: Room[], startDate: string, endDate: string) {

    let sumRoomsPercentage = 0;
    for (let room of rooms) sumRoomsPercentage += room.occupancyPercentage(startDate, endDate);

    return sumRoomsPercentage / rooms.length;
}

function availableRooms (rooms: Room[], startDate: string, endDate: string): Room[] {
    let iterateD = new Date(startDate);
    let arrayAvRooms: Room[] = [];
    const startD = new Date(startDate);
    const endD = new Date(endDate);

    for (let room of rooms) {
        while (iterateD <= endD) {
            if (!room.isOccupied(iterateD)) {
                arrayAvRooms.push(room);
                break;
            }
            iterateD.setDate(iterateD.getDate() +1);       
        }
    }

    if (!arrayAvRooms.length) return [];

    return arrayAvRooms;
}


module.exports = {
    Room,
    Booking,
    totalOccupancyPercentage,
    availableRooms,
};

let room = new Room("room1", 100, 0);
let room2 = new Room("room2", 200, 0);
let room3 = new Room("room3", 300, 0);
let date = new Date();

let booking = new Booking("bookingName", "test@email", "2022/11/01", "2022/11/05", 0, room);
let booking2 = new Booking("booking2Name", "test2@email", "2022/11/02", "2022/11/06", 0, room);
let booking3 = new Booking("booking3Name", "test3@email", "2022/12/21", "2022/12/30", 0, room);

booking = new Booking("bookingName", "test@email", "2022/11/01", "2022/11/30", 0, room);
booking2 = new Booking("booking2Name", "test2@email", "2022/11/02", "2022/11/30", 0, room);
booking3 = new Booking("booking3Name", "test3@email", "2022/11/21", "2022/12/30", 0, room);

let bookings = [booking, booking2, booking3];
room.bookings = bookings;

booking = new Booking("bookingName", "test@email", "2022/12/01", "2022/12/30", 0, room2);
booking2 = new Booking("booking2Name", "test2@email", "2022/11/11", "2022/12/30", 0, room2);
booking3 = new Booking("booking3Name", "test3@email", "2022/11/19", "2022/12/30", 0, room2);
booking = new Booking("bookingName", "test@email", "2022/11/01", "2022/11/30", 0, room2);
booking2 = new Booking("booking2Name", "test2@email", "2022/11/11", "2022/11/30", 0, room2);
booking3 = new Booking("booking3Name", "test3@email", "2022/11/01", "2022/11/30", 0, room2);
bookings = [booking, booking2, booking3];
room2.bookings = bookings;

let startDate = "2022/12/21";
let endDate = "2022/12/26";

// 30 / 60 => 50
// room.bookings = [new Booking("bookingName", "test@email", "2022/12/21", "2022/12/30", 0, room)];
console.log("----------");
// console.log(room.occupancyPercentage())
// console.log(totalOccupancyPercentage([room, room2], "2022/12/01", "2022/12/30"));
console.log(availableRooms([room, room2],  "2022/11/01",  "2022/11/10"));
console.log("----------");