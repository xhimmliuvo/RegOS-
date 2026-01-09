// =====================================================
// EXCEL EXPORT UTILITY
// Generate Excel exports for registrations
// =====================================================

/**
 * Export registration submissions to Excel
 * Uses SheetJS (xlsx) library
 */
export async function exportToExcel(registration, submissions, options = {}) {
    // Dynamically import XLSX to avoid SSR issues
    const XLSX = await import('xlsx');

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Get form fields
    const formFields = registration.formSchema || [];

    // Build submissions data
    const submissionsData = submissions.map((sub, index) => {
        const row = {
            '#': index + 1,
            'Status': sub.status || 'pending',
            'Submitted At': new Date(sub.submittedAt).toLocaleString(),
        };

        formFields.forEach(field => {
            row[field.label] = sub.formData?.[field.id] || '';
        });

        if (sub.notes) {
            row['Notes'] = sub.notes;
        }

        return row;
    });

    // Create submissions sheet
    const submissionsSheet = XLSX.utils.json_to_sheet(submissionsData);

    // Set column widths
    const colWidths = [
        { wch: 5 },  // #
        { wch: 12 }, // Status
        { wch: 20 }, // Submitted At
        ...formFields.map(() => ({ wch: 20 })),
    ];
    submissionsSheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, submissionsSheet, 'Submissions');

    // Create summary sheet
    const summaryData = [
        { 'Property': 'Title', 'Value': registration.title || '' },
        { 'Property': 'Category', 'Value': registration.category || '' },
        { 'Property': 'Status', 'Value': registration.status || '' },
        { 'Property': 'Total Submissions', 'Value': submissions.length },
        { 'Property': 'Total Views', 'Value': registration.viewCount || 0 },
        { 'Property': 'Start Date', 'Value': registration.startDate ? new Date(registration.startDate).toLocaleDateString() : '' },
        { 'Property': 'End Date', 'Value': registration.endDate ? new Date(registration.endDate).toLocaleDateString() : '' },
        { 'Property': 'Exported At', 'Value': new Date().toLocaleString() },
    ];

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 20 }, { wch: 40 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Generate filename
    const filename = options.filename ||
        `${(registration.title || 'export').replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.xlsx`;

    // Export
    if (options.returnBuffer) {
        return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    }

    XLSX.writeFile(workbook, filename);
    return filename;
}

/**
 * Export simple data to Excel
 */
export async function exportDataToExcel(data, sheetName = 'Data', filename = 'export.xlsx') {
    const XLSX = await import('xlsx');

    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.json_to_sheet(data);

    // Auto-size columns
    const colWidths = Object.keys(data[0] || {}).map(key => ({
        wch: Math.max(key.length, 15)
    }));
    sheet['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    XLSX.writeFile(workbook, filename);

    return filename;
}

/**
 * Create a multi-sheet Excel workbook
 */
export async function createMultiSheetExcel(sheets, filename = 'export.xlsx') {
    const XLSX = await import('xlsx');

    const workbook = XLSX.utils.book_new();

    sheets.forEach(({ name, data }) => {
        const sheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, sheet, name);
    });

    XLSX.writeFile(workbook, filename);
    return filename;
}
