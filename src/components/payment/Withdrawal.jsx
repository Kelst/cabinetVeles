import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Tooltip,
} from '@mui/material';
import { CalendarToday, Description, AccountBalance, TrendingUp, Category } from '@mui/icons-material';
import useStore from '../../store/store';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  background: '#2d3338', // Changed from black to dark gray
  borderRadius: '16px',
  padding: '16px',
  height: '55vh',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#3a4147', // Lighter gray
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#4a5d23', // Dark olive green
    borderRadius: '4px',
    '&:hover': {
      background: '#6b8e23', // Lighter olive green
    },
  },
}));

const StyledTable = styled(Table)({
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '2px',
    background: 'linear-gradient(90deg, #4a5d23, #6b8e23, #4a5d23)', // Green gradient
    animation: 'gradient 3s ease infinite',
    backgroundSize: '200% 100%',
  },
});

const HeaderCell = styled(TableCell)(({ theme }) => ({
  background: '#1e2327', // Very dark gray
  color: '#ffffff',
  fontWeight: '600',
  padding: '16px',
  fontSize: '0.9rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '1px solid #3a4147',
  whiteSpace: 'nowrap',
}));

const DataCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.85rem',
  padding: '12px 16px',
  color: '#ffffff',
  borderBottom: '1px solid #3a4147',
  backgroundColor: '#2d3338',
}));

const StyledTableRow = styled(TableRow)({
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#3a4147 !important',
    '& td': {
      backgroundColor: '#3a4147 !important',
    }
  },
});

const SummaryRow = styled(TableRow)({
  backgroundColor: '#3a4147',
  '& td': {
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#3a4147 !important',
  },
});

const IconWrapper = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  color: '#ffffff',
});

const TypeBadge = styled('span')(({ type }) => ({
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: '500',
  backgroundColor: '#3a4147',
  color: '#ffffff',
  border: '1px solid #4a5d23', // Olive green border
}));

function formatDate(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function WithdrawalTable() {
  const getFees = useStore(state => state.getFees);
  const uid = useStore(state => state.user.uid);
  const [paid, setPaid] = useState({
    count: 0,
    sum: 0,
    paidData: []
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const feesData = await getFees(uid);
        setPaid(feesData.fees);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, [getFees]);
  
  return (
    <Box sx={{ 
      p: 2, 
      animation: 'fadeIn 0.5s ease-out',
      background: 'linear-gradient(145deg, #2d3338, #3a4147)', // Darker grays gradient
      borderRadius: '20px',
    }}>
      <StyledTableContainer component={Paper}>
        <StyledTable>
          <TableHead>
            <TableRow>
              <HeaderCell>
                <IconWrapper>
                  <CalendarToday sx={{ fontSize: 18, color: '#6b8e23' }} />
                  <span>Дата</span>
                </IconWrapper>
              </HeaderCell>
              <HeaderCell align="center">
                <IconWrapper>
                  <Description sx={{ fontSize: 18, color: '#6b8e23' }} />
                  <span>Опис</span>
                </IconWrapper>
              </HeaderCell>
              <HeaderCell align="center">
                <IconWrapper>
                  <TrendingUp sx={{ fontSize: 18, color: '#6b8e23' }} />
                  <span>Сума</span>
                </IconWrapper>
              </HeaderCell>
              <HeaderCell align="center">
                <IconWrapper>
                  <AccountBalance sx={{ fontSize: 18, color: '#6b8e23' }} />
                  <span>Залишок</span>
                </IconWrapper>
              </HeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paid.paidData.map((row, index) => (
              <StyledTableRow
                key={index}
                sx={{ animation: `slideIn 0.3s ease-out ${index * 0.1}s` }}
              >
                <DataCell>{formatDate(row.date)}</DataCell>
                <Tooltip title={row.description} placement="top-start">
                  <DataCell align="center" sx={{ 
                    maxWidth: '200px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {row.description}
                  </DataCell>
                </Tooltip>
                <DataCell align="center">{formatCurrency(row.sum)}</DataCell>
                <DataCell align="center">{formatCurrency(row.deposit)}</DataCell>
              </StyledTableRow>
            ))}
            <SummaryRow>
              <DataCell rowSpan={2} />
              <DataCell colSpan={2}>Всього операцій</DataCell>
              <DataCell align="center">{paid.count}</DataCell>
              <DataCell />
            </SummaryRow>
            <SummaryRow>
              <DataCell colSpan={2}>Загальна сума</DataCell>
              <DataCell align="center">{formatCurrency(paid.sum)}</DataCell>
              <DataCell />
            </SummaryRow>
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
      
      <style>
        {`
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </Box>
  );
}