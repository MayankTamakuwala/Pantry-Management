import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from '@/lib/firebase';
import PantryForm from './PantryForm';
import PantrySearch from './PantrySearch';
import { DataGrid, GridColDef, GridRowModesModel, GridRowModes, GridRenderCellParams, GridEventListener } from '@mui/x-data-grid';
import useDebounce from '@/hooks/useDebounce';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Tab } from '@mui/material';
import { Delete, Edit, Save } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import CameraComponent from './CameraComponent';
import { useAuth } from '@/context/AuthContext';

interface PantryItem {
    id?: string;
    name: string;
    quantity: number;
}

const PantryManager: React.FC = () => {
    const [items, setItems] = useState<PantryItem[]>([]);
    const [filteredItems, setFilteredItems] = useState<PantryItem[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const { user } = useAuth();
    const [tabValue, setTabValue] = useState('1')

    const fetchItems = async () => {
        if(user){
            const q = query(collection(db, `users/${user.uid}/pantry`));
            const querySnapshot = await getDocs(q);
            const itemsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PantryItem[];
            setItems(itemsList);
            setFilteredItems(itemsList);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    useEffect(() => {
        if (debouncedSearchQuery) {
            const filtered = items.filter(item =>
                item.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
            );
            setFilteredItems(filtered);
        } else {
            setFilteredItems(items);
        }
    }, [debouncedSearchQuery, items]);

    const handleDelete = async (id: string) => {
        if(user){
            await deleteDoc(doc(db, `users/${user.uid}/pantry`, id));
            setConfirmDelete(false);
            setDeleteItemId(null);
            fetchItems();
        }
    };

    // const handleSave = async (params: GridRenderCellParams) => {
    //     const itemRef = doc(db, 'pantry', params.row.id);
    //     await updateDoc(itemRef, {
    //         name: params.row.name,
    //         quantity: params.row.quantity
    //     });
    //     fetchItems();
    //     setRowModesModel((prevModel) => ({
    //         ...prevModel,
    //         [params.id]: { mode: GridRowModes.View, fieldToFocus: undefined },
    //     }));
    // };

    const handleRowEditStart: GridEventListener<'rowEditStart'> = (params, event) => {
        event.defaultMuiPrevented = true;
        setRowModesModel((prevModel) => ({
            ...prevModel,
            [params.id]: { mode: GridRowModes.Edit },
        }));
    };

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        event.defaultMuiPrevented = true;
        setRowModesModel((prevModel) => ({
            ...prevModel,
            [params.id]: { mode: GridRowModes.View },
        }));
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue + '');
    };

    const processRowUpdate = async (newRow: PantryItem) => {
        if(user){
            const itemRef = doc(db, `users/${user.uid}/pantry`, newRow.id!);
            await updateDoc(itemRef, {
                name: newRow.name,
                quantity: newRow.quantity
            });
            fetchItems();
        }
        return newRow;
    };

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Item Name',
            flex: 1,
            align: "center",
            headerAlign: "center",
            editable: false,
        },
        {
            field: 'quantity',
            headerName: 'Quantity',
            type: 'number',
            flex: 1,
            align: "center",
            editable: true,
            headerAlign: "center",
        },
        {
            field: 'actions',
            headerName: 'Actions',
            editable: false,
            align: 'center',
            headerAlign: 'center',
            width: 100,
            renderCell: (params) => (
                <>
                    <Dialog open={confirmDelete && deleteItemId === params.row.id}>
                        <DialogTitle>Are you sure you want to delete this item?</DialogTitle>
                        <DialogContent>
                            <DialogContentText>This action cannot be undone.</DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
                            <Button onClick={() => handleDelete(params.row.id)}>Delete</Button>
                        </DialogActions>
                    </Dialog>
                    <IconButton
                        onClick={() => {
                            setRowModesModel((prevModel) => ({
                                ...prevModel,
                                [params.id]: { mode: GridRowModes.Edit },
                            }));
                        }}
                    >
                        <Edit />
                    </IconButton>
                    <IconButton onClick={() => { setConfirmDelete(true); setDeleteItemId(params.row.id); }}>
                        <Delete />
                    </IconButton>
                </>
            ),
            // renderEditCell: (params) => (
            //     <>
            //         <IconButton
            //             onClick={() => handleSave(params)}
            //         >
            //             <Save />
            //         </IconButton>
            //         <IconButton
            //             onClick={() => {
            //                 setConfirmDelete(true);
            //                 setDeleteItemId(params.row.id);
            //             }}
            //         >
            //             <Delete />
            //         </IconButton>
            //     </>
            // )
        }
    ];

    return (
        <>
            <PantrySearch onSearch={setSearchQuery} />
            <TabContext value={tabValue}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleTabChange} centered>
                        <Tab label="Add Using Form" value="1" />
                        <Tab label="Add Using Camera" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    <PantryForm
                        className='flex justify-center items-center gap-x-7'
                        refreshItems={fetchItems}
                    />
                </TabPanel>
                <TabPanel value="2">
                    <CameraComponent refreshItems={fetchItems}/>
                </TabPanel>
            </TabContext>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={filteredItems}
                    columns={columns}
                    editMode="row"
                    rowModesModel={rowModesModel}
                    onRowEditStart={handleRowEditStart}
                    onRowEditStop={handleRowEditStop}
                    processRowUpdate={processRowUpdate}
                    onRowDoubleClick={(p, e) => {e.stopPropagation()}}
                />
            </div>
        </>
    );
};

export default PantryManager;