#include <functional>
#include <QList>
#include <QTime>
#include <QCursor>
#include <QApplication>
#include <QMainWindow>
#include <QWidget>
#include <QVBoxLayout>
#include <QHBoxLayout>
#include <QGridLayout>
#include <QPushButton>
#include <QLabel>
#include <QDialog>
#include <QLineEdit>
#include <QComboBox>
#include <QPlainTextEdit>
#include <QFileDialog>
#include <QMessageBox>
#include <QMenu>
#include <QTimer>
#include <QDateTime>
#include <QFile>
#include <QTextStream>
#include <QDir>
#include <QScreen>
#include <QStyleFactory>
#include <QDoubleValidator>
#include <QPalette>
#include <QFont>

class CrossOS : public QMainWindow {
private:
    QWidget *desktop;
    QLabel *clockLabel;
    bool darkMode = true;

    QString buttonStyle =
        "QPushButton {"
        "background:#243B55;"
        "color:white;"
        "border:1px solid #36516F;"
        "border-radius:12px;"
        "padding:15px;"
        "font-size:14px;"
        "}"
        "QPushButton:hover {"
        "background:#315D83;"
        "}";

    QPushButton *makeButton(
        const QString &name,
        const QString &symbol
    ) {
        QPushButton *button =
            new QPushButton(symbol + "\n" + name);

        button->setMinimumSize(105, 90);
        button->setStyleSheet(buttonStyle);

        return button;
    }

    QDialog *makeWindow(
        const QString &title,
        int width = 420,
        int height = 320
    ) {
        QDialog *window = new QDialog(this);

        window->setWindowTitle(title);
        window->resize(width, height);
        window->setAttribute(Qt::WA_DeleteOnClose);

        return window;
    }

    void openCalculator() {
        QDialog *window =
            makeWindow("CROSS Calculator", 350, 300);

        auto *layout = new QVBoxLayout(window);

        auto *first = new QLineEdit;
        auto *second = new QLineEdit;
        auto *operation = new QComboBox;
        auto *result = new QLabel("Result: 0");
        auto *calculate = new QPushButton("Calculate");

        first->setPlaceholderText("First number");
        second->setPlaceholderText("Second number");

        first->setValidator(new QDoubleValidator(first));
        second->setValidator(new QDoubleValidator(second));

        operation->addItems({"+", "-", "×", "÷"});

        result->setStyleSheet(
            "font-size:20px;font-weight:bold;color:#3296DC;"
        );

        layout->addWidget(new QLabel("CROSS Calculator"));
        layout->addWidget(first);
        layout->addWidget(operation);
        layout->addWidget(second);
        layout->addWidget(calculate);
        layout->addWidget(result);

        connect(calculate, &QPushButton::clicked,
                window, [=]() {
            bool ok1, ok2;

            double a = first->text().toDouble(&ok1);
            double b = second->text().toDouble(&ok2);

            if (!ok1 || !ok2) {
                result->setText("Enter valid numbers.");
                return;
            }

            double answer = 0;

            switch (operation->currentIndex()) {
                case 0: answer = a + b; break;
                case 1: answer = a - b; break;
                case 2: answer = a * b; break;
                case 3:
                    if (b == 0) {
                        result->setText("Cannot divide by zero.");
                        return;
                    }
                    answer = a / b;
                    break;
            }

            result->setText(
                "Result: " + QString::number(answer, 'g', 12)
            );
        });

        window->show();
    }

    void openNotepad() {
        QDialog *window =
            makeWindow("CROSS Notepad", 600, 450);

        auto *layout = new QVBoxLayout(window);
        auto *editor = new QPlainTextEdit;
        auto *save = new QPushButton("Save File");
        auto *open = new QPushButton("Open File");

        layout->addWidget(editor);

        auto *buttons = new QHBoxLayout;
        buttons->addWidget(open);
        buttons->addWidget(save);
        layout->addLayout(buttons);

        connect(save, &QPushButton::clicked,
                window, [=]() {
            QString path = QFileDialog::getSaveFileName(
                window, "Save text", QDir::homePath(),
                "Text files (*.txt)"
            );

            if (path.isEmpty()) return;

            QFile file(path);

            if (file.open(QIODevice::WriteOnly |
                          QIODevice::Text)) {
                QTextStream out(&file);
                out << editor->toPlainText();
                QMessageBox::information(
                    window, "CROSS", "File saved."
                );
            }
        });

        connect(open, &QPushButton::clicked,
                window, [=]() {
            QString path = QFileDialog::getOpenFileName(
                window, "Open text", QDir::homePath(),
                "Text files (*.txt);;All files (*)"
            );

            if (path.isEmpty()) return;

            QFile file(path);

            if (file.open(QIODevice::ReadOnly |
                          QIODevice::Text)) {
                QTextStream in(&file);
                editor->setPlainText(in.readAll());
            }
        });

        window->show();
    }

    void openFiles() {
        QDialog *window =
            makeWindow("CROSS File Manager", 450, 300);

        auto *layout = new QVBoxLayout(window);
        auto *path = new QLabel(QDir::homePath());
        auto *browse = new QPushButton("Browse Files");
        auto *folder = new QPushButton("Open Folder");

        layout->addWidget(new QLabel("CROSS FILE MANAGER"));
        layout->addWidget(path);
        layout->addWidget(browse);
        layout->addWidget(folder);

        connect(browse, &QPushButton::clicked,
                window, [=]() {
            QString file = QFileDialog::getOpenFileName(
                window, "Select a file", QDir::homePath()
            );

            if (!file.isEmpty())
                path->setText(file);
        });

        connect(folder, &QPushButton::clicked,
                window, [=]() {
            QString dir = QFileDialog::getExistingDirectory(
                window, "Select folder", QDir::homePath()
            );

            if (!dir.isEmpty())
                path->setText(dir);
        });

        window->show();
    }

    void openClock() {
        QDialog *window =
            makeWindow("CROSS Clock", 350, 200);

        auto *layout = new QVBoxLayout(window);
        auto *time = new QLabel;

        time->setAlignment(Qt::AlignCenter);
        time->setStyleSheet(
            "font-size:38px;font-weight:bold;color:#3296DC;"
        );

        auto *date = new QLabel;
        date->setAlignment(Qt::AlignCenter);

        layout->addWidget(new QLabel("CROSS DIGITAL CLOCK"));
        layout->addWidget(time);
        layout->addWidget(date);

        auto *timer = new QTimer(window);

        connect(timer, &QTimer::timeout,
                window, [=]() {
            QDateTime now = QDateTime::currentDateTime();

            time->setText(now.toString("hh:mm:ss"));
            date->setText(now.toString("dddd, MMMM d, yyyy"));
        });

        timer->start(1000);

        window->show();
    }

    void openSettings() {
        QDialog *window =
            makeWindow("CROSS Settings", 400, 260);

        auto *layout = new QVBoxLayout(window);
        auto *theme = new QPushButton(
            darkMode ? "Switch to Light Mode"
                     : "Switch to Dark Mode"
        );

        layout->addWidget(new QLabel("CROSS SYSTEM SETTINGS"));
        layout->addWidget(new QLabel("Appearance"));
        layout->addWidget(theme);

        connect(theme, &QPushButton::clicked,
                window, [=]() {
            darkMode = !darkMode;
            applyTheme();

            theme->setText(
                darkMode ? "Switch to Light Mode"
                         : "Switch to Dark Mode"
            );
        });

        layout->addWidget(new QLabel(
            "CROSS OS Simulator 1.0\nBuilt with C++ and Qt 6"
        ));

        window->show();
    }

    void openSystemInfo() {
        QMessageBox::information(
            this,
            "About CROSS OS",
            "CROSS OS Simulator 1.0\n\n"
            "Engine: C++17\n"
            "GUI: Qt 6 Widgets\n"
            "Platform: Termux\n\n"
            "A custom CROSS desktop environment."
        );
    }

    void applyTheme() {
        if (darkMode) {
            desktop->setStyleSheet(
                "QWidget {"
                "background:#101C2C;"
                "color:white;"
                "}"
            );
        } else {
            desktop->setStyleSheet(
                "QWidget {"
                "background:#E7EEF6;"
                "color:#17283D;"
                "}"
            );
        }
    }

    void openStartMenu() {
        QMenu menu(this);

        menu.addAction("Calculator", this,
                       [this]() { openCalculator(); });

        menu.addAction("File Manager", this,
                       [this]() { openFiles(); });

        menu.addAction("Notepad", this,
                       [this]() { openNotepad(); });

        menu.addAction("Clock", this,
                       [this]() { openClock(); });

        menu.addAction("Settings", this,
                       [this]() { openSettings(); });

        menu.addSeparator();

        menu.addAction("System Info", this,
                       [this]() { openSystemInfo(); });

        menu.exec(QCursor::pos());
    }

public:
    CrossOS() {
        setWindowTitle("CROSS OS Simulator");
        resize(1000, 680);
        setMinimumSize(360, 500);

        desktop = new QWidget;
        setCentralWidget(desktop);

        auto *mainLayout = new QVBoxLayout(desktop);
        mainLayout->setContentsMargins(20, 15, 20, 10);
        mainLayout->setSpacing(15);

        auto *header = new QHBoxLayout;

        auto *logo = new QLabel("CROSS OS");
        logo->setStyleSheet(
            "font-size:27px;font-weight:bold;color:#3296DC;"
        );

        auto *subtitle = new QLabel("Your Digital Workspace");

        header->addWidget(logo);
        header->addStretch();
        header->addWidget(subtitle);

        mainLayout->addLayout(header);

        auto *welcome = new QLabel("Welcome to CROSS.");
        welcome->setStyleSheet(
            "font-size:25px;font-weight:bold;"
        );

        mainLayout->addWidget(welcome);

        auto *grid = new QGridLayout;
        grid->setSpacing(15);

        struct App {
            QString name;
            QString icon;
            std::function<void()> launch;
        };

        QList<App> applications = {
            {"Calculator", "🧮",
                [this]() { openCalculator(); }},
            {"File Manager", "📁",
                [this]() { openFiles(); }},
            {"Settings", "⚙",
                [this]() { openSettings(); }},
            {"Clock", "🕒",
                [this]() { openClock(); }},
            {"Notepad", "📝",
                [this]() { openNotepad(); }},
            {"System Info", "💻",
                [this]() { openSystemInfo(); }}
        };

        for (int i = 0; i < applications.size(); ++i) {
            auto app = applications[i];

            auto *button = makeButton(app.name, app.icon);

            connect(button, &QPushButton::clicked,
                    this, app.launch);

            grid->addWidget(button, i / 3, i % 3);
        }

        mainLayout->addLayout(grid);
        mainLayout->addStretch();

        auto *taskbar = new QHBoxLayout;

        auto *start = new QPushButton("CROSS  ⊞");
        start->setStyleSheet(
            "background:#2566A0;color:white;"
            "padding:12px;border-radius:8px;"
            "font-weight:bold;"
        );

        connect(start, &QPushButton::clicked,
                this, [this]() { openStartMenu(); });

        auto *taskInfo = new QLabel("CROSS Desktop");

        clockLabel = new QLabel;
        clockLabel->setStyleSheet(
            "font-weight:bold;padding:10px;"
        );

        taskbar->addWidget(start);
        taskbar->addWidget(taskInfo);
        taskbar->addStretch();
        taskbar->addWidget(clockLabel);

        mainLayout->addLayout(taskbar);

        auto *timer = new QTimer(this);

        connect(timer, &QTimer::timeout,
                this, [this]() {
            clockLabel->setText(
                QTime::currentTime().toString("hh:mm:ss")
            );
        });

        timer->start(1000);

        applyTheme();
    }
};

int main(int argc, char *argv[]) {
    QApplication app(argc, argv);

    app.setApplicationName("CROSS OS");
    app.setStyle(QStyleFactory::create("Fusion"));

    CrossOS desktop;
    desktop.show();

    return app.exec();
}
