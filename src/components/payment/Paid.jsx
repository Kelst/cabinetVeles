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
} from '@mui/material';
import { CalendarToday, Description, AccountBalance, TrendingUp } from '@mui/icons-material';
import useStore from '../../store/store';

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  background: '#000000', // sky-800 background
  borderRadius: '16px',
  padding: '16px',
  height: '55vh',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#92c7f5', // Matte sky-800
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#77cdec', // sky sky
    borderRadius: '4px',
    '&:hover': {
      background: '#90EE90', // Lighter sky sky on hover
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
    background: 'linear-gradient(90deg, #92c7f5, #77cdec, #92c7f5)', // sky-800 and sky sky gradient
    animation: 'gradient 3s ease infinite',
  },
});

const HeaderCell = styled(TableCell)(({ theme }) => ({
  background: '#000000', // sky-800
  color: '#77cdec', // sky sky
  fontWeight: '600',
  padding: '16px',
  fontSize: '0.9rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '1px solid #92c7f5',
  transition: 'all 0.3s ease',
  '&:first-of-type': {
    borderTopLeftRadius: '8px',
  },
  '&:last-child': {
    borderTopRightRadius: '8px',
  },
}));

const DataCell = styled(TableCell)(({ theme }) => ({
  fontSize: '0.85rem',
  padding: '12px 16px',
  color: '#ffffff',
  borderBottom: '1px solid #92c7f5',
  backgroundColor: '#000000',
}));

const StyledTableRow = styled(TableRow)({
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#92c7f5 !important',
    '& td': {
      backgroundColor: '#92c7f5 !important',
    }
  },
});

const SummaryRow = styled(TableRow)({
  backgroundColor: '#92c7f5',
  '& td': {
    fontWeight: 'bold',
    color: '#77cdec', // sky sky
    backgroundColor: '#92c7f5 !important',
  },
});

const IconWrapper = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  color: '#77cdec', // sky sky
});

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

export default function DarkPaidTable() {
  const getPayments = useStore(state => state.getPayments);
  const uid = useStore(state => state.user.uid);
  const [paid, setPaid] = useState({
    count: 0,
    sum: 0,
    paidData: []
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const paymentsData = await getPayments(uid);
        setPaid(paymentsData.payments);
      } catch (error) {
        console.error('Error fetching payments:', error);
      }
    };

    fetchPayments();
  }, [getPayments, uid]);

  return (
    <Box sx={{ 
      p: 2, 
      animation: 'fadeIn 0.5s ease-out',
      background: 'linear-gradient(145deg, #000000, #92c7f5)', // sky-800 and matte sky-800 gradient
      borderRadius: '20px',
    }}>
      <StyledTableContainer component={Paper}>
        <StyledTable>
          <TableHead>
            <TableRow>
              <HeaderCell>
                <IconWrapper>
                  <CalendarToday sx={{ fontSize: 18, color: '#77cdec' }} /> {/* sky sky */}
                  <span>Дата</span>
                </IconWrapper>
              </HeaderCell>
              <HeaderCell align="center">
                <IconWrapper>
                  <Description sx={{ fontSize: 18, color: '#77cdec' }} />
                  <span>Опис</span>
                </IconWrapper>
              </HeaderCell>
              <HeaderCell align="center">
                <IconWrapper>
                  <TrendingUp sx={{ fontSize: 18, color: '#77cdec' }} />
                  <span>Сума</span>
                </IconWrapper>
              </HeaderCell>
              <HeaderCell align="center">
                <IconWrapper>
                  <AccountBalance sx={{ fontSize: 18, color: '#77cdec' }} />
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
                <DataCell align="center">{row.description}</DataCell>
                <DataCell align="center">{formatCurrency(row.sum)}</DataCell>
                <DataCell 
                  align="center"
                  sx={{ 
                    color: row.deposit < 0 ? '#77cdec' : '#ffffff', // Changed to sky sky
                    fontWeight: row.deposit < 0 ? 'bold' : 'normal'
                  }}
                >
                  {formatCurrency(row.deposit)}
                </DataCell>
              </StyledTableRow>
            ))}
            <SummaryRow>
              <DataCell rowSpan={2} />
              <DataCell colSpan={2}>Всього операцій</DataCell>
              <DataCell align="center">{paid.count}</DataCell>
            </SummaryRow>
            <SummaryRow>
              <DataCell colSpan={2}>Загальна сума</DataCell>
              <DataCell 
                align="center"
                sx={{ 
                  color: paid.sum < 0 ? '#77cdec' : '#ffffff', // Changed to sky sky
                  fontWeight: 'bold'
                }}
              >
                {formatCurrency(paid.sum)}
              </DataCell>
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