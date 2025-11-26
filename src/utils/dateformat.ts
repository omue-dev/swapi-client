export const formatDate = (
    dateString: Date,
  ) => {
    if (!dateString) return ''; 
    // Parse the ISO date string
    const date = new Date(dateString);
  
    // Extract date components
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Monate sind 0-basiert
    const year = date.getFullYear();
    
    // Extract time components
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    // Format the date as dd.mm.yyyy hh:mm
    const formattedDate = `${day}.${month}.${year}`;
  
    return formattedDate;
  }
