const { Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun, AlignmentType, BorderStyle, VerticalAlign } = require('docx');
const ExcelJS = require('exceljs');

/**
 * Xuất báo cáo thành file Word (.docx)
 */
async function exportReportToWord(report) {
  const rows = [];

  // Header
  rows.push(
    new TableRow({
      cells: [
        new TableCell({
          children: [new Paragraph({ text: 'BÁO CÁO HỆ THỐNG QUẢN LÝ PHÒNG SERVER', bold: true, size: 28 })],
          columnSpan: 4,
        }),
      ],
    })
  );

  rows.push(
    new TableRow({
      cells: [
        new TableCell({
          children: [new Paragraph({ text: `Kỳ báo cáo: ${report.period}`, bold: true })],
          columnSpan: 4,
        }),
      ],
    })
  );

  rows.push(
    new TableRow({
      cells: [
        new TableCell({
          children: [new Paragraph({ text: `Tạo lúc: ${new Date(report.generatedAt).toLocaleString('vi-VN')}` })],
          columnSpan: 4,
        }),
      ],
    })
  );

  // Health Score
  rows.push(
    new TableRow({
      cells: [
        new TableCell({
          children: [new Paragraph({ text: `Sức khỏe hệ thống: ${report.systemMetrics.healthScore}%`, bold: true, color: 'FFFFFF' })],
          columnSpan: 4,
          shading: { fill: '28a745' },
        }),
      ],
    })
  );

  // System Metrics
  rows.push(
    new TableRow({
      cells: [
        new TableCell({ children: [new Paragraph({ text: 'PHÒNG MÁY', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: report.systemMetrics.rooms.total.toString(), alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: report.systemMetrics.rooms.normal.toString(), alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: report.systemMetrics.rooms.warning.toString(), alignment: AlignmentType.CENTER })] }),
      ],
    })
  );

  rows.push(
    new TableRow({
      cells: [
        new TableCell({ children: [new Paragraph({ text: '', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: 'Tổng', alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: 'Bình thường', alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: 'Cảnh báo', alignment: AlignmentType.CENTER })] }),
      ],
    })
  );

  // Temperature Trends
  rows.push(
    new TableRow({
      cells: [
        new TableCell({
          children: [new Paragraph({ text: 'NHIỆT ĐỘ', bold: true })],
          columnSpan: 4,
        }),
      ],
    })
  );

  rows.push(
    new TableRow({
      cells: [
        new TableCell({ children: [new Paragraph({ text: 'Tối thiểu (°C)', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: report.tempTrends.temperature.min.toString(), alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: 'Tối đa (°C)', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: report.tempTrends.temperature.max.toString(), alignment: AlignmentType.CENTER })] }),
      ],
    })
  );

  rows.push(
    new TableRow({
      cells: [
        new TableCell({ children: [new Paragraph({ text: 'TB (°C)', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: report.tempTrends.temperature.avg, alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: 'Trung vị (°C)', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: report.tempTrends.temperature.median.toString(), alignment: AlignmentType.CENTER })] }),
      ],
    })
  );

  // Equipment
  rows.push(
    new TableRow({
      cells: [
        new TableCell({
          children: [new Paragraph({ text: 'THIẾT BỊ', bold: true })],
          columnSpan: 4,
        }),
      ],
    })
  );

  rows.push(
    new TableRow({
      cells: [
        new TableCell({ children: [new Paragraph({ text: 'Tổng', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: report.systemMetrics.equipment.total.toString(), alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: 'Có sẵn', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: report.systemMetrics.equipment.available.toString(), alignment: AlignmentType.CENTER })] }),
      ],
    })
  );

  rows.push(
    new TableRow({
      cells: [
        new TableCell({ children: [new Paragraph({ text: 'Hỏng', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: report.systemMetrics.equipment.damaged.toString(), alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: 'Sử dụng', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: `${report.equipmentStatus.utilizationRate}%`, alignment: AlignmentType.CENTER })] }),
      ],
    })
  );

  // Maintenance
  rows.push(
    new TableRow({
      cells: [
        new TableCell({
          children: [new Paragraph({ text: 'BẢO TRÌ', bold: true })],
          columnSpan: 4,
        }),
      ],
    })
  );

  rows.push(
    new TableRow({
      cells: [
        new TableCell({ children: [new Paragraph({ text: 'Tổng', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: report.maintenanceSummary.total.toString(), alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: 'Hoàn thành', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: report.maintenanceSummary.completed.toString(), alignment: AlignmentType.CENTER })] }),
      ],
    })
  );

  rows.push(
    new TableRow({
      cells: [
        new TableCell({ children: [new Paragraph({ text: 'Chi phí tổng', bold: true })] }),
        new TableCell({ 
          children: [new Paragraph({ text: `${report.maintenanceSummary.totalCost.toLocaleString('vi-VN')} đ`, alignment: AlignmentType.CENTER })],
          columnSpan: 3
        }),
      ],
    })
  );

  // Incidents
  rows.push(
    new TableRow({
      cells: [
        new TableCell({
          children: [new Paragraph({ text: 'SỰ CỐ', bold: true })],
          columnSpan: 4,
        }),
      ],
    })
  );

  rows.push(
    new TableRow({
      cells: [
        new TableCell({ children: [new Paragraph({ text: 'Tổng', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: report.incidentSummary.total.toString(), alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: 'Giải quyết', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: report.incidentSummary.resolved.toString(), alignment: AlignmentType.CENTER })] }),
      ],
    })
  );

  rows.push(
    new TableRow({
      cells: [
        new TableCell({ children: [new Paragraph({ text: 'Cấp độ cao', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: report.incidentSummary.bySeverity.critical.toString(), alignment: AlignmentType.CENTER })] }),
        new TableCell({ children: [new Paragraph({ text: 'Thời gian TB', bold: true })] }),
        new TableCell({ children: [new Paragraph({ text: `${report.incidentSummary.avgResolutionTimeMinutes} phút`, alignment: AlignmentType.CENTER })] }),
      ],
    })
  );

  // Recommendations
  rows.push(
    new TableRow({
      cells: [
        new TableCell({
          children: [new Paragraph({ text: 'GỢI Ý CẢI THIỆN', bold: true })],
          columnSpan: 4,
        }),
      ],
    })
  );

  report.recommendations.forEach((rec) => {
    rows.push(
      new TableRow({
        cells: [
          new TableCell({
            children: [new Paragraph({ text: `${rec.priority.toUpperCase()}: ${rec.title}`, bold: true })],
            columnSpan: 4,
          }),
        ],
      })
    );
    rows.push(
      new TableRow({
        cells: [
          new TableCell({
            children: [new Paragraph({ text: rec.description })],
            columnSpan: 4,
          }),
        ],
      })
    );
    rows.push(
      new TableRow({
        cells: [
          new TableCell({
            children: [new Paragraph({ text: `Hành động: ${rec.action}`, italic: true })],
            columnSpan: 4,
          }),
        ],
      })
    );
  });

  const table = new Table({
    rows,
    width: { size: 100, type: 'pct' },
  });

  const doc = new Document({
    sections: [{ children: [table] }],
  });

  return await Packer.toBuffer(doc);
}

/**
 * Xuất báo cáo thành file Excel (.xlsx)
 */
async function exportReportToExcel(report) {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Báo Cáo');

    // Set column widths
    worksheet.columns = [
      { header: 'Chỉ số', key: 'col1', width: 30 },
      { header: 'Giá trị', key: 'col2', width: 25 },
    ];

    let rowNum = 1;

    // Header
    worksheet.getCell(`A${rowNum}`).value = 'BÁO CÁO HỆ THỐNG QUẢN LÝ PHÒNG SERVER';
    worksheet.getCell(`A${rowNum}`).font = { bold: true, size: 14 };
    worksheet.mergeCells(`A${rowNum}:B${rowNum}`);
    rowNum++;

    // Period
    worksheet.getCell(`A${rowNum}`).value = `Kỳ báo cáo: ${report.period}`;
    worksheet.getCell(`A${rowNum}`).font = { bold: true };
    worksheet.mergeCells(`A${rowNum}:B${rowNum}`);
    rowNum++;

    // Created
    worksheet.getCell(`A${rowNum}`).value = `Tạo lúc: ${new Date(report.generatedAt).toLocaleString('vi-VN')}`;
    worksheet.mergeCells(`A${rowNum}:B${rowNum}`);
    rowNum++;

    // Health Score
    rowNum++;
    worksheet.getCell(`A${rowNum}`).value = `Sức khỏe hệ thống: ${report.systemMetrics.healthScore}%`;
    worksheet.getCell(`A${rowNum}`).font = { bold: true };
    worksheet.mergeCells(`A${rowNum}:B${rowNum}`);
    rowNum++;

    // System Metrics - Rooms
    rowNum++;
    worksheet.getCell(`A${rowNum}`).value = 'PHÒNG MÁY';
    worksheet.getCell(`A${rowNum}`).font = { bold: true };
    rowNum++;
    worksheet.getCell(`A${rowNum}`).value = 'Tổng';
    worksheet.getCell(`B${rowNum}`).value = report.systemMetrics.rooms?.total || 0;
    rowNum++;
    worksheet.getCell(`A${rowNum}`).value = 'Bình thường';
    worksheet.getCell(`B${rowNum}`).value = report.systemMetrics.rooms?.normal || 0;
    rowNum++;
    worksheet.getCell(`A${rowNum}`).value = 'Cảnh báo';
    worksheet.getCell(`B${rowNum}`).value = report.systemMetrics.rooms?.warning || 0;
    rowNum++;

    // Temperature
    rowNum++;
    worksheet.getCell(`A${rowNum}`).value = 'NHIỆT ĐỘ';
    worksheet.getCell(`A${rowNum}`).font = { bold: true };
    rowNum++;
    worksheet.getCell(`A${rowNum}`).value = 'Tối thiểu (°C)';
    worksheet.getCell(`B${rowNum}`).value = report.tempTrends?.temperature?.min || 0;
    rowNum++;
    worksheet.getCell(`A${rowNum}`).value = 'Tối đa (°C)';
    worksheet.getCell(`B${rowNum}`).value = report.tempTrends?.temperature?.max || 0;
    rowNum++;
    worksheet.getCell(`A${rowNum}`).value = 'TB (°C)';
    worksheet.getCell(`B${rowNum}`).value = report.tempTrends?.temperature?.avg || 0;
    rowNum++;

    // Equipment
    rowNum++;
    worksheet.getCell(`A${rowNum}`).value = 'THIẾT BỊ';
    worksheet.getCell(`A${rowNum}`).font = { bold: true };
    rowNum++;
    worksheet.getCell(`A${rowNum}`).value = 'Tổng';
    worksheet.getCell(`B${rowNum}`).value = report.systemMetrics?.equipment?.total || 0;
    rowNum++;
    worksheet.getCell(`A${rowNum}`).value = 'Có sẵn';
    worksheet.getCell(`B${rowNum}`).value = report.systemMetrics?.equipment?.available || 0;
    rowNum++;

    // Maintenance
    rowNum++;
    worksheet.getCell(`A${rowNum}`).value = 'BẢO TRÌ';
    worksheet.getCell(`A${rowNum}`).font = { bold: true };
    rowNum++;
    worksheet.getCell(`A${rowNum}`).value = 'Tổng';
    worksheet.getCell(`B${rowNum}`).value = report.maintenanceSummary?.total || 0;
    rowNum++;
    worksheet.getCell(`A${rowNum}`).value = 'Hoàn thành';
    worksheet.getCell(`B${rowNum}`).value = report.maintenanceSummary?.completed || 0;
    rowNum++;

    // Incidents
    rowNum++;
    worksheet.getCell(`A${rowNum}`).value = 'SỰ CỐ';
    worksheet.getCell(`A${rowNum}`).font = { bold: true };
    rowNum++;
    worksheet.getCell(`A${rowNum}`).value = 'Tổng';
    worksheet.getCell(`B${rowNum}`).value = report.incidentSummary?.total || 0;
    rowNum++;
    worksheet.getCell(`A${rowNum}`).value = 'Giải quyết';
    worksheet.getCell(`B${rowNum}`).value = report.incidentSummary?.resolved || 0;
    rowNum++;

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    console.error('Error in exportReportToExcel:', error);
    throw error;
  }
}

module.exports = {
  exportReportToWord,
  exportReportToExcel,
};
