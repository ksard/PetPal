import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

export const YourAppointments = ({ appointments }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Owner Name</TableCell>
            <TableCell>Center Name</TableCell>
            <TableCell>Center Address</TableCell>
            <TableCell>Appointment Date</TableCell>
            <TableCell>Slot</TableCell>
            <TableCell>Pet Name</TableCell>
            <TableCell>Species (Breed)</TableCell>
            <TableCell>Weight</TableCell>
            <TableCell>Medical History</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment._id}>
              <TableCell>{`${appointment.ownerInfo.fName} ${appointment.ownerInfo.lName}`}</TableCell>
              <TableCell>{appointment.centerName}</TableCell>
              <TableCell>{appointment.centerAddress}</TableCell>
              <TableCell>{appointment.date}</TableCell>
              <TableCell>{appointment.slot}</TableCell>
              <TableCell>{appointment.petInfo.petName}</TableCell>
              <TableCell>{`${appointment.petInfo.species} (${appointment.petInfo.breed})`}</TableCell>
              <TableCell>{appointment.petInfo.weight}</TableCell>
              <TableCell>{appointment.petInfo.medicalHistory || 'No medical history'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
