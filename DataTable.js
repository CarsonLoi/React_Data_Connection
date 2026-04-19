import React, { useState, useMemo } from "react";
import { Table, Typography, Link, Stack, Box, IconButton } from '@mui/joy';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { CASINO_RESTAURANTS } from '../constants';

// Column definitions and sub-groups
const SUB_PITS = ["MS", "Pit 883", "Pit 888", "Pit 889", "Salon"];

export const TABLE_COLUMNS = [
    { id: 'ID', label: ['ID'], numeric: false },
    { id: 'Sales', label: ['Sales'], numeric: false },
    { id: 'Team', label: ['Team'], numeric: false },
    { id: 'Region', label: ['Region'], numeric: false },
    { id: 'Card', label: ['Card'], numeric: false },
    { id: 'Playday', label: ['TG Play', 'days'], numeric: true },
    { id: 'ADT', label: ['TG ADT'], numeric: true },
    { id: 'CasinoWin', label: ['Casino', 'TG Win'], numeric: true },
    { id: 'Theowin_TG', label: ['TG', 'Theo'], numeric: true, expandable: true, subKeys: SUB_PITS.map(p => `Theowin_TG_${p}`) },
    { id: 'Timeplayed_TG', label: ['TG', 'Time'], numeric: true, expandable: true, subKeys: SUB_PITS.map(p => `Timeplayed_TG_${p}`) },
    { id: 'CasinoFB', label: ['Casino', 'F&B'], numeric: true, expandable: true, subKeys: CASINO_RESTAURANTS },
    { id: 'PropertyFB', label: ['Property', 'F&B'], numeric: true, expandable: true, dynamicDetail: true },
];

const DETAIL_COLUMNS = [
    { id: 'Date', label: ['Date'] },
    { id: 'BD_Sales', label: ['Host'] },
    { id: 'Table_To', label: ['Table'] },
    { id: 'MinutesPlayed', label: ['Minutes'], numeric: true },
    { id: 'Theowin', label: ['Theo'], numeric: true },
    { id: 'CasinoWin', label: ['Win'], numeric: true },
    { id: 'Card', label: ['Card'] },
];

const COLUMN_COLORS = {
    info: '#303144',
    casino: '#284B63',
    time: '#5F5566',
    fnb: '#917B45',
    property: '#8497B0'
};

const getColumnColor = (id) => {
    if (['ID', 'Sales', 'Team', 'Region', 'ADT', 'CasinoWin', 'Card', 'Date', 'Table_To', 'BD_Sales'].includes(id)) return COLUMN_COLORS.info;
    if (id.startsWith('Theowin_TG')) return COLUMN_COLORS.casino;
    if (id.startsWith('Timeplayed_TG')) return COLUMN_COLORS.time;
    if (CASINO_RESTAURANTS.includes(id) || id === 'CasinoFB') return COLUMN_COLORS.fnb;
    return COLUMN_COLORS.property;
};

// Helper for time formatting: transforms seconds into "h m" or just "h" if > 100h
const formatTimeValue = (seconds) => {
    if (!seconds || seconds <= 0) return '0';
    const totalMinutes = Math.round(seconds / 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    if (h >= 100) return `${h}h`;
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
};

// Helper for currency formatting: >= 1M -> 1.1m, < 1M -> 100k
const formatCurrencyValue = (val) => {
    if (val === undefined || val === null || val === 0) return '0';
    const absVal = Math.abs(val);
    if (absVal >= 1000000) {
        return (val / 1000000).toFixed(1) + 'm';
    }
    // For values lower than 1M, show as k. If very small (e.g. < 500), could round to 0 or 1k.
    const kVal = Math.round(val / 1000);
    return kVal + 'k';
};

const DataTable = ({ data, detailData, isExpand, toggles }) => {
    const [order, setOrder] = useState('desc');
    const [orderBy, setOrderBy] = useState('Theowin_TG');

    const isDetailView = detailData && detailData.length > 0;
    const activeData = isDetailView ? detailData : data;

    const handleSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Helper to split labels into 2 lines if they contain a space
    const getSplitLabel = (str) => {
        const parts = str.split(' ');
        if (parts.length > 1) {
            return [parts.slice(0, Math.ceil(parts.length / 2)).join(' '), parts.slice(Math.ceil(parts.length / 2)).join(' ')];
        }
        return [str];
    };

    // Flatten columns to include expanded sub-columns
    const renderedColumns = useMemo(() => {
        const baseColumns = TABLE_COLUMNS.map(col => {
            if (isDetailView && col.id === 'ID') {
                return { id: 'Date', label: ['Date'], numeric: false };
            }
            return col;
        });

        const cols = [];
        baseColumns.forEach(col => {
            cols.push(col);
            if (col.expandable && isExpand[col.id]) {
                if (col.subKeys) {
                    col.subKeys.forEach(sk => {
                        const subLabelText = sk.replace('Theowin_TG_', '').replace('Timeplayed_TG_', '');
                        cols.push({ id: sk, label: getSplitLabel(subLabelText), numeric: true, isSub: true, parentKey: col.id });
                    });
                } else if (col.dynamicDetail) {
                    // Find all property restaurants in data
                    const restaurants = new Set();
                    activeData.forEach(row => {
                        Object.keys(row).forEach(key => {
                            if (!TABLE_COLUMNS.find(c => c.id === key) && !CASINO_RESTAURANTS.includes(key) && !SUB_PITS.some(p => key.includes(p))) {
                                if (typeof row[key] === 'number' && key !== 'ADT' && key !== 'Playday' && key !== 'CasinoWin' && key !== 'Theowin_TG' && key !== 'Timeplayed_TG') {
                                    restaurants.add(key);
                                }
                            }
                        });
                    });
                    [...restaurants].sort().forEach(r => {
                        cols.push({ id: r, label: getSplitLabel(r), numeric: true, isSub: true, parentKey: col.id });
                    });
                }
            }
        });
        return cols;
    }, [isDetailView, isExpand, activeData]);

    const formatDate = (dateStr) => {
        try {
            if (!dateStr) return '';
            const parts = dateStr.toString().split('-');
            if (parts.length === 3) {
                const date = new Date(parts[0], parts[1] - 1, parts[2]);
                return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
            }
            return dateStr;
        } catch (e) {
            return dateStr;
        }
    };

    const sortedData = useMemo(() => {
        // Map UI sorting key to data key (ID becomes Date in detail view)
        const sortKey = (isDetailView && orderBy === 'ID') ? 'Date' : orderBy;

        return [...activeData].sort((a, b) => {
            const valA = a[sortKey] ?? -Infinity;
            const valB = b[sortKey] ?? -Infinity;

            if (valB < valA) return order === 'desc' ? -1 : 1;
            if (valB > valA) return order === 'desc' ? 1 : -1;
            return 0;
        });
    }, [activeData, order, orderBy, isDetailView]);

    const totals = useMemo(() => {
        if (!sortedData || sortedData.length === 0) return null;

        const sum = {};
        renderedColumns.forEach(col => {
            if (col.numeric) {
                sum[col.id] = 0;
            }
        });

        let totalTheo = 0;
        let totalPlayday = 0;

        sortedData.forEach(row => {
            renderedColumns.forEach(col => {
                if (col.numeric) {
                    sum[col.id] += (row[col.id] || 0);
                }
            });
            totalTheo += (row['Theowin_TG'] || 0);
            totalPlayday += (row['Playday'] || 0);
        });

        if (sum['ADT'] !== undefined) {
            sum['ADT'] = totalPlayday > 0 ? totalTheo / totalPlayday : 0;
        }

        return sum;
    }, [sortedData, renderedColumns]);

    return (
        <Box sx={{
            width: '100%',
            backgroundColor: 'rgba(50,52,72,0.8)',
            margin: 0,
            px: '0px',
            borderWidth: 0,
            pb: '0px',
            maxHeight: '400px',
            overflowY: "scroll",
            overflowX: 'scroll',

            listStyle: "none",
            height: "100%",
            '&::-webkit-scrollbar': {
                width: '0.4em'
            },
            '&::-webkit-scrollbar-track': {
                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
            },
            '&::-webkit-scrollbar-thumb:horizontal': {
                backgroundColor: 'rgba(0,0,0,.1)',
                outline: '1px solid slategrey'
            }
        }}>
            <Box sx={{ p: 1, backgroundColor: isDetailView ? '#1a3a5a' : '#2d2e3d', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
                <Typography level="body-sm" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {isDetailView ? `Patron Detail View: ${detailData[0].ID}` : 'Patron Summary View'}
                </Typography>
            </Box>
            <Table
                stickyHeader
                borderAxis="bothBetween"
                sx={{
                    '& thead th': { color: 'white', fontSize: '0.85rem', p: 1 },
                    tableLayout: 'fixed',
                    width: 'max-content'
                }}
            >
                <thead>
                    <tr>
                        {renderedColumns.map((col) => {
                            const width = col.isSub ? '80px' : (col.expandable ? '110px' : '90px');
                            return (
                                <th
                                    key={col.id}
                                    style={{
                                        backgroundColor: getColumnColor(col.id),
                                        textAlign: 'center',
                                        width: width,
                                        minWidth: width,
                                        maxWidth: width,
                                        padding: '4px 8px',
                                        verticalAlign: 'middle'
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
                                        <Link
                                            component="button"
                                            underline="none"
                                            onClick={() => handleSort(col.id)}
                                            sx={{
                                                color: 'white',
                                                fontWeight: col.isSub ? 'normal' : 'bold',
                                                textDecoration: 'none',
                                                fontSize: '0.85rem',
                                                lineHeight: 1.1,
                                                textAlign: 'center',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                '&:hover': { textDecoration: 'none', color: 'rgba(255,255,255,0.8)' }
                                            }}
                                        >

                                            {col.label.map((line, idx) => (
                                                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                                    {line}
                                                    {idx === col.label.length - 1 && orderBy === col.id && (
                                                        <ArrowDownwardIcon
                                                            sx={{
                                                                fontSize: '0.85rem',
                                                                ml: 0.5,
                                                                transform: order === 'asc' ? 'rotate(180deg)' : 'none',
                                                                flexShrink: 0
                                                            }}
                                                        />
                                                    )}
                                                </Box>
                                            ))}
                                        </Link>

                                        {col.expandable && (
                                            <IconButton size="sm" onClick={(e) => { e.stopPropagation(); toggles[col.id](); }} sx={{ color: 'white', ml: 0.5, p: 0 }}>
                                                {isExpand[col.id] ? <CloseFullscreenIcon sx={{ fontSize: '1rem' }} /> : <OpenInFullIcon sx={{ fontSize: '1rem' }} />}
                                            </IconButton>
                                        )}
                                    </Stack>
                                </th>
                            );
                        })}
                    </tr>
                </thead>

                <tbody>
                    {sortedData.map((row, i) => (
                        <tr key={i} style={{ backgroundColor: i % 2 !== 0 ? 'rgba(0, 0, 0, 0.15)' : 'transparent' }}>
                            {renderedColumns.map((col) => {
                                const width = col.isSub ? '80px' : (col.expandable ? '110px' : '90px');
                                const value = row[col.id] || 0;
                                let percentage = null;

                                // Calculate percentage for Theo, Time, and FnB sub-columns
                                if (col.isSub && (col.parentKey === 'Theowin_TG' || col.parentKey === 'Timeplayed_TG' || col.parentKey === 'CasinoFB' || col.parentKey === 'PropertyFB')) {
                                    const total = row[col.parentKey];
                                    if (total > 0) {
                                        percentage = (value / total) * 100;
                                    }
                                }


                                return (
                                    <td
                                        key={col.id}
                                        style={{
                                            color: 'rgba(240,240,240,1)',
                                            textAlign: 'center',
                                            fontSize: '0.85rem',
                                            width: width,
                                            minWidth: width,
                                            maxWidth: width,
                                            overflow: 'hidden',
                                            padding: '4px 8px'
                                        }}
                                    >
                                        <Box sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            height: '40px' 
                                        }}>
                                            <Typography level="inherit" sx={{ fontWeight: 'normal', color: 'inherit', fontSize: 'inherit' }}>
                                                {col.numeric
                                                    ? (col.id.startsWith('Timeplayed')
                                                        ? formatTimeValue(value)
                                                        : (col.id.startsWith('Theowin') || col.id === 'CasinoWin' || col.id === 'ADT'
                                                            ? formatCurrencyValue(value)
                                                            : value.toLocaleString(undefined, { maximumFractionDigits: 0 })))
                                                    : (col.id === 'Date' ? formatDate(row[col.id]) : row[col.id])}
                                            </Typography>

                                            {percentage !== null && (
                                                <Typography level="inherit" sx={{ color: 'rgba(200,200,200,0.7)', fontSize: 'inherit', mt: 0 }}>
                                                    ({percentage.toFixed(0)}%)
                                                </Typography>
                                            )}

                                        </Box>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    {totals && (
                        <tr style={{ backgroundColor: 'rgba(98, 60, 234, 0.3)', borderTop: '2px solid rgba(255,255,255,0.3)' }}>
                            {renderedColumns.map((col) => {
                                const width = col.isSub ? '80px' : (col.expandable ? '110px' : '90px');
                                let value = '';
                                if (col.id === 'ID' || col.id === 'Date') {
                                    value = 'TOTAL';
                                } else if (col.numeric) {
                                    value = totals[col.id] || 0;
                                }
                                
                                let percentage = null;
                                if (col.isSub && (col.parentKey === 'Theowin_TG' || col.parentKey === 'Timeplayed_TG' || col.parentKey === 'CasinoFB' || col.parentKey === 'PropertyFB')) {
                                    const totalParent = totals[col.parentKey];
                                    if (totalParent > 0) {
                                        percentage = (value / totalParent) * 100;
                                    }
                                }

                                return (
                                    <td
                                        key={`total-${col.id}`}
                                        style={{
                                            color: 'rgba(255,255,255,1)',
                                            textAlign: 'center',
                                            fontSize: '0.85rem',
                                            fontWeight: 'bold',
                                            width: width,
                                            minWidth: width,
                                            maxWidth: width,
                                            overflow: 'hidden',
                                            padding: '4px 8px'
                                        }}
                                    >
                                        <Box sx={{ 
                                            display: 'flex', 
                                            flexDirection: 'column', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            height: '40px' 
                                        }}>
                                            <Typography level="inherit" sx={{ fontWeight: 'bold', color: 'inherit', fontSize: 'inherit' }}>
                                                {value === 'TOTAL' ? value : (col.numeric
                                                    ? (col.id.startsWith('Timeplayed')
                                                        ? formatTimeValue(value)
                                                        : (col.id.startsWith('Theowin') || col.id === 'CasinoWin' || col.id === 'ADT'
                                                            ? formatCurrencyValue(value)
                                                            : value.toLocaleString(undefined, { maximumFractionDigits: 0 })))
                                                    : '')}
                                            </Typography>

                                            {percentage !== null && (
                                                <Typography level="inherit" sx={{ color: 'rgba(200,200,200,0.7)', fontSize: 'inherit', mt: 0, fontWeight: 'normal' }}>
                                                    ({percentage.toFixed(0)}%)
                                                </Typography>
                                            )}

                                        </Box>
                                    </td>
                                );
                            })}
                        </tr>
                    )}
                </tbody>
            </Table>
        </Box>
    );
};








export default DataTable;
