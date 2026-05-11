import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { BoardDetail } from "@/shared/types";

const s = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", backgroundColor: "#ffffff" },
  header: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: "bold", color: "#0f0f0f" },
  meta: { fontSize: 10, color: "#888", marginTop: 4 },
  column: { marginBottom: 20 },
  colHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  colDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7c3aed",
    marginRight: 8,
  },
  colTitle: { fontSize: 13, fontWeight: "bold", color: "#1a1a1a" },
  colCount: { fontSize: 10, color: "#999", marginLeft: 6 },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    padding: "8 10",
    marginBottom: 6,
    borderLeft: "3px solid #7c3aed",
  },
  cardTitle: { fontSize: 11, fontWeight: "bold", color: "#1a1a1a" },
  cardDesc: { fontSize: 9, color: "#666", marginTop: 3, lineHeight: 1.4 },
  empty: { fontSize: 10, color: "#bbb", fontStyle: "italic", paddingLeft: 16 },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 8, color: "#bbb" },
});

export function BoardReport({ board }: { board: BoardDetail }) {
  const totalCards = board.columns.reduce(
    (acc, col) => acc + col.cards.length,
    0,
  );
  const generatedAt = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>{board.title}</Text>
          <Text style={s.meta}>
            {generatedAt} · {board.columns.length} columns · {totalCards} cards
            total
          </Text>
          {board.description && (
            <Text style={[s.meta, { marginTop: 8, color: "#555" }]}>
              {board.description}
            </Text>
          )}
        </View>

        {/* Columns */}
        {board.columns.map((col) => (
          <View key={col.id} style={s.column}>
            <View style={s.colHeader}>
              <View style={s.colDot} />
              <Text style={s.colTitle}>{col.title}</Text>
              <Text style={s.colCount}>({col.cards.length})</Text>
            </View>

            {col.cards.length === 0 ? (
              <Text style={s.empty}>No cards</Text>
            ) : (
              col.cards.map((card) => (
                <View key={card.id} style={s.card}>
                  <Text style={s.cardTitle}>{card.title}</Text>
                  {card.description && (
                    <Text style={s.cardDesc}>{card.description}</Text>
                  )}
                </View>
              ))
            )}
          </View>
        ))}

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>Kanban Board · {board.title}</Text>
          <Text
            style={s.footerText}
            render={({ pageNumber, totalPages }) =>
              `${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
