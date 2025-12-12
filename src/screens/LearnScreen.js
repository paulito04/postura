import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import LearningCard from "../components/learning/LearningCard";
import SearchBar from "../components/learning/SearchBar";
import SectionHeader from "../components/learning/SectionHeader";
import { learningData as initialLearningData } from "../data/learningData";
import LearningDetailScreen from "./LearningDetailScreen";
import { usePoints } from "../PointsManager";
import { useUser } from "../UserContext";
import { useTheme } from "../theme/ThemeProvider";

const STORAGE_KEYS = {
  favorites: "LEARNING_FAVORITES",
  history: "LEARNING_HISTORY",
  content: "LEARNING_CONTENT",
};

const sectionEmojis = {
  "Fundamentos Ergonómicos": "📚",
  "Posturas Correctas": "🪑",
  "Consecuencias de mala postura": "⚠️",
  "Ejercicios Preventivos": "💪",
  "Configuración de Espacio": "🖥️",
};

export default function LearnScreen() {
  const { theme } = useTheme();
  const { colors } = theme;
  const { addPoints } = usePoints();
  const { user } = useUser();
  const [learningItems, setLearningItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const hydrateData = async () => {
      try {
        const [storedFavorites, storedHistory, storedContent] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.favorites),
          AsyncStorage.getItem(STORAGE_KEYS.history),
          AsyncStorage.getItem(STORAGE_KEYS.content),
        ]);

        const favoritesList = storedFavorites ? JSON.parse(storedFavorites) : [];
        const historyList = storedHistory ? JSON.parse(storedHistory) : [];
        const parsedContent = storedContent ? JSON.parse(storedContent) : initialLearningData;
        const mappedContent = parsedContent.map((item) => ({
          ...item,
          favorite: favoritesList.includes(item.id),
        }));

        if (!storedContent) {
          await AsyncStorage.setItem(STORAGE_KEYS.content, JSON.stringify(initialLearningData));
        }

        setFavorites(favoritesList);
        setHistory(historyList);
        setLearningItems(mappedContent);
      } catch (error) {
        console.warn("Error cargando contenido educativo", error);
        setLearningItems(initialLearningData.map((item) => ({ ...item, favorite: false })));
      }
    };

    hydrateData();
  }, []);

  useEffect(() => {
    const persistData = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites));
        await AsyncStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
        await AsyncStorage.setItem(STORAGE_KEYS.content, JSON.stringify(learningItems));
      } catch (error) {
        console.warn("Error guardando estado educativo", error);
      }
    };

    if (learningItems.length) {
      persistData();
    }
  }, [favorites, history, learningItems]);

  const toggleFavorite = (id) => {
    setLearningItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              favorite: !item.favorite,
            }
          : item
      )
    );

    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const handleSelect = (item) => {
    setSelectedItem(item);
    handleCompleteArticle(item);
  };

  const isProUser = user?.plan === "MoveUp Pro" || user?.isPro === true;

  const handleCompleteArticle = (article) => {
    if (!article?.id) return;

    setHistory((prev) => {
      if (prev.includes(article.id)) return prev;
      const updated = [...prev, article.id];
      addPoints(
        10,
        `Artículo completado: ${article.title || "contenido de aprendizaje"}`,
        isProUser
      );
      return updated;
    });
  };

  const totalItems = learningItems.length || initialLearningData.length;
  const progress = useMemo(
    () => (totalItems ? Math.round(((history.length || 0) / totalItems) * 100) : 0),
    [history.length, totalItems]
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return learningItems;
    return learningItems.filter((item) => item.title.toLowerCase().includes(query));
  }, [learningItems, searchQuery]);

  const sections = useMemo(() => {
    const grouped = filteredItems.reduce((acc, item) => {
      const key = item.section;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    return Object.keys(grouped).map((title) => ({
      title: `${sectionEmojis[title] || ""} ${title}`,
      data: grouped[title],
      rawTitle: title,
    }));
  }, [filteredItems]);

  const favoriteItems = useMemo(() => learningItems.filter((item) => favorites.includes(item.id)), [favorites, learningItems]);
  const historyItems = useMemo(() => learningItems.filter((item) => history.includes(item.id)), [history, learningItems]);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.eyebrow}>Aprender</Text>
      <Text style={styles.title}>Aprende sobre Ergonomía</Text>
      <Text style={styles.subtitle}>Conocimientos para mejorar tu postura diaria</Text>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Progreso de aprendizaje</Text>
          <Text style={styles.progressValue}>{progress}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressHelper}>{`Has leído ${history.length} de ${totalItems} artículos`}</Text>
      </View>

      <View style={styles.quickRow}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Sistema de favoritos</Text>
        </View>
        <View style={styles.pillMuted}>
          <Text style={styles.pillTextMuted}>Modo offline activo</Text>
        </View>
      </View>

      {favoriteItems.length > 0 && (
        <View style={styles.favoritesBlock}>
          <Text style={styles.blockTitle}>Tus favoritos</Text>
          <View style={styles.favoritesRow}>
            {favoriteItems.slice(0, 3).map((fav) => (
              <TouchableOpacity key={fav.id} onPress={() => handleSelect(fav)} style={styles.favoriteTag}>
                <Text style={styles.favoriteIcon}>★</Text>
                <Text style={styles.favoriteLabel} numberOfLines={1}>
                  {fav.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {historyItems.length > 0 && (
        <View style={styles.historyBlock}>
          <Text style={styles.blockTitle}>Historial de leídas</Text>
          {historyItems.slice(-3).map((item) => (
            <Text key={item.id} style={styles.historyItem}>
              • {item.title}
            </Text>
          ))}
        </View>
      )}
    </View>
  );

  if (selectedItem) {
    const currentItem = learningItems.find((article) => article.id === selectedItem.id) || selectedItem;

    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <LearningDetailScreen
          item={currentItem}
          onBack={() => setSelectedItem(null)}
          onToggleFavorite={() => toggleFavorite(currentItem.id)}
          onMarkRead={handleCompleteArticle}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
        renderItem={({ item }) => (
          <LearningCard
            item={{ ...item, favorite: favorites.includes(item.id) || item.favorite }}
            onPress={() => handleSelect(item)}
            onToggleFavorite={() => toggleFavorite(item.id)}
          />
        )}
        SectionSeparatorComponent={() => <View style={{ height: 14 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    gap: 12,
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3B82F6",
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 15,
    color: "#4B5563",
    marginBottom: 6,
  },
  progressCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1D4ED8",
  },
  progressValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1D4ED8",
  },
  progressBarBackground: {
    height: 10,
    borderRadius: 10,
    backgroundColor: "#DBEAFE",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 10,
  },
  progressHelper: {
    fontSize: 13,
    color: "#374151",
  },
  quickRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pill: {
    backgroundColor: "#DFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  pillMuted: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  pillText: {
    color: "#0EA5E9",
    fontWeight: "800",
  },
  pillTextMuted: {
    color: "#4B5563",
    fontWeight: "700",
  },
  favoritesBlock: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  favoritesRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  favoriteTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
  },
  favoriteIcon: {
    color: "#F59E0B",
  },
  favoriteLabel: {
    maxWidth: 180,
    color: "#1F2937",
    fontWeight: "700",
  },
  blockTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
  historyBlock: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  historyItem: {
    color: "#4B5563",
    fontSize: 13,
  },
});
