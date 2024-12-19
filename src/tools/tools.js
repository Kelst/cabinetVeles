export  function daysAndHoursUntilEndOfMonth() {
    let currentDate = new Date();
    let lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    let timeDifference = lastDayOfMonth - currentDate;
    let days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    let hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return {
      days: days,
      hours: hours
    };
  }
  export function extractInfoFromString(inputString) {
    const matchSpread = inputString.match(/(\d+)\(/);
    const spead = matchSpread ? matchSpread[1] : null;
    const matchPrice = inputString.match(/\(([^)]+)\)/);
    const price = matchPrice ? matchPrice[1] : null;
  
    return { spead, price };
  }


