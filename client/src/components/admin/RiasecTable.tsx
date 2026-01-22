import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import theme from "../../theme/theme";
import { RiasecItem } from "../../types/RiasecTypes";

interface Props {
  items: RiasecItem[];
  tableKey: string;
}

/**
 * RiasecTable Component
 *
 * Displays a table of RIASEC items (study areas, fields, or programs) with search and edit functionality.
 *
 * Features:
 * - Search bar filters table rows by any property
 * - Editable items via Edit dialog (except "id" and "name")
 * - Highlights null values
 * - Table headers are dynamic based on item keys
 * - Action column with Edit button (not shown for "studiengaenge" table)
 *
 * @param param0 items: RiasecItem[] → array of items to display
 * @param param1 tableKey: string → identifies which table is being rendered ("studiengebiete", "studienfelder", "studiengaenge")
 * @returns JSX Element
 */
export default function RiasecTable({ items, tableKey }: Props) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editItem, setEditItem] = useState<RiasecItem | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: any }>({});
  const isStudiengangTable = useMemo(() => {
    return tableKey === "studiengaenge";
  }, [tableKey]);

  // Filtert Items nach Suchstring
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const term = searchTerm.toLowerCase();
    return items.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(term),
      ),
    );
  }, [items, searchTerm]);

  const columns = useMemo(() => {
    if (!items.length) return [];
    return Object.keys(items[0]).filter((key) => key !== "id");
  }, [items]);

  type EditValues = {
    [K in keyof RiasecItem]?: RiasecItem[K] | null;
  };

  useEffect(() => {
    if (!editItem) return;

    const values: EditValues = {};

    (Object.keys(editItem) as (keyof RiasecItem)[])
      .filter((key) => key !== "id" && key !== "name")
      .forEach((key) => {
        values[key] = editItem[key] as any;
      });

    setEditValues(values);
  }, [editItem]);

  const handleEdit = (item: RiasecItem) => {
    setEditItem(item);
  };

  const handleClose = () => {
    setEditItem(null);
    setEditValues({});
    window.location.reload();
  };

  const handleEditValueChange = (key: string, value: any) => {
    setEditValues((prev) => ({ ...prev, [key]: value }));
  };

  const getChangedValues = (original: RiasecItem, edited: EditValues) => {
    const changes: EditValues = {};

    (Object.keys(edited) as (keyof RiasecItem)[]).forEach((key) => {
      if (key === "id") return; // id darf nie verändert werden

      const originalValue = original[key];
      const editedValue = edited[key];

      if (editedValue !== undefined && editedValue !== originalValue) {
        changes[key] = editedValue as any;
      }
    });

    return changes;
  };

  const handleSave = async () => {
    if (!editItem) return;

    try {
      const changes = getChangedValues(editItem, editValues);

      const data = {
        table: tableKey,
        id: editItem.id,
        changes: changes,
      };

      await fetch(`/api/admin/edit-riasec-data`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      handleClose();
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
    }
  };

  if (!items.length) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 4,
          color: theme.palette.text.subHeader,
        }}
      >
        <Typography variant="body1">Keine Daten verfügbar</Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Suchen..."
          fullWidth
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.palette.text.subHeader }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.palette.background.default,
              borderRadius: "9px",
            },
          }}
        />
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 500,
          borderRadius: "9px",
          border: `1px solid ${theme.palette.background.paper}`,
          boxShadow: "none",
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col}
                  sx={{
                    backgroundColor: theme.palette.decorative.blue,
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    textTransform: "capitalize",
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                  }}
                >
                  {col}
                </TableCell>
              ))}
              {!isStudiengangTable && (
                <TableCell
                  sx={{
                    backgroundColor: theme.palette.decorative.blue,
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    borderBottom: `2px solid ${theme.palette.primary.main}`,
                  }}
                >
                  Aktion
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  sx={{
                    textAlign: "center",
                    py: 4,
                    backgroundColor: theme.palette.background.default,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Keine Ergebnisse gefunden
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: theme.palette.decorative.blue,
                      opacity: 0.7,
                    },
                  }}
                >
                  {columns.map((col) => (
                    <TableCell
                      key={`${item.id}-${col}`}
                      sx={{
                        backgroundColor:
                          item[col as keyof RiasecItem] === null
                            ? theme.palette.background.paper
                            : theme.palette.background.default,
                      }}
                    >
                      {typeof item[col as keyof RiasecItem] === "number" ? (
                        <Typography variant="body2">
                          {item[col as keyof RiasecItem] === null
                            ? "null"
                            : item[col as keyof RiasecItem]}
                        </Typography>
                      ) : (
                        item[col as keyof RiasecItem]
                      )}
                    </TableCell>
                  ))}
                  {!isStudiengangTable && (
                    <TableCell
                      sx={{ backgroundColor: theme.palette.background.default }}
                    >
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleEdit(item)}
                        sx={{
                          "&:hover": {
                            backgroundColor: theme.palette.primary.main,
                            color: "#fff",
                          },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog
        open={!!editItem}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: "9px",
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.decorative.blue,
            color: theme.palette.text.primary,
            fontWeight: 600,
          }}
        >
          {editItem?.name || "Eintrag"}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {editItem &&
            Object.keys(editItem)
              .filter((key) => key !== "id" && key !== "name")
              .map((key) => (
                <TextField
                  key={`edit-${editItem.id}-${key}`}
                  label={key}
                  fullWidth
                  margin="normal"
                  size="small"
                  value={editValues[key] ?? ""}
                  onChange={(e) => {
                    const value =
                      typeof editItem[key as keyof RiasecItem] === "number"
                        ? e.target.value === ""
                          ? null
                          : Number(e.target.value)
                        : e.target.value;
                    handleEditValueChange(key, value);
                  }}
                  type={
                    typeof editItem[key as keyof RiasecItem] === "number"
                      ? "number"
                      : "text"
                  }
                />
              ))}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleClose}
            sx={{
              borderRadius: "9px",
              color: theme.palette.text.primary,
            }}
          >
            Abbrechen
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            sx={{
              borderRadius: "9px",
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.decorative.blueDark,
              },
            }}
          >
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
